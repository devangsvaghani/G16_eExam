import User from '../models/user.js'
import Otp from '../models/otp.js'
import {send_otp} from "../utils/authentication.js"
import { generateToken } from '../config/jwtUtils.js'
import bcrypt from "bcrypt"

export const create_user = async (req, res) => {
    try {
        // console.log(req.body);
        const { username, email, password, mobileno, dob, role} = req.body;

        // Basic validations
        if (!username || !email || !password || !mobileno || !dob || !role) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        // Check username length (e.g., minimum 3, maximum 20 characters)
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: 'Username must be between 3 and 20 characters.' });
        }

        // Check password length (e.g., minimum 8 characters)
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }

        // Email validation (basic regex pattern for email format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // Check mobile number length (assuming mobile number should be exactly 10 digits)
        const mobilenoRegex = /^\d{10}$/;
        if (!mobilenoRegex.test(mobileno)) {
            return res.status(400).json({ error: 'Mobile number must be exactly 10 digits.' });
        }

        // DOB validation (expecting format 'DD-MM-YYYY')
        const dobRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (!dobRegex.test(dob)) {
            return res.status(400).json({ error: 'Invalid date of birth format. Use YYYY-MM-DD.' });
        }

        const [day, month, year] = dob.split('-').map(Number);
        const date = new Date(year, month - 1, day); // Month is 0-indexed in JS Date

        // Check for valid day, month, and year in dob
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            return res.status(400).json({ error: 'Invalid date of birth values.' });
        }
  
        let user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
        if (user || role === "Admin") {
            return res.status(409).json({ error: 'User already exists!'});
        }
        
        user = await User.create(req.body);

        return res.status(201).json({ message: 'User created successfully!' });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ error: error.message });
    }
}

export const create_session = async (req, res) => {
    try {
        const { emailUsername, password } = req.body;
        let user = await User.findOne({ $or: [{ email: emailUsername }, { username: emailUsername }] });
        
        if (!user || password !== user.password || user.username === "admin") {
            return res.status(401).json({ error: 'Invalid Email/Username or Password!' });
        }

        const token = generateToken(user);
        return res.status(200).json({ token: token, username: user.username });

    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ error: error });
    }
};

export const admin_login = async (req, res) => {
    try{
        const { password } = req.body;

        let admin = await User.findOne({username: "admin"});
        // console.log(admin.password)
        // console.log(password)
        if(!admin || admin.password !== password){
            return res.status(401).json({ error: 'Invalid Email/Username or Password!' });
        }

        const token = generateToken(admin);
        return res.status(200).json({ token: token, username: admin.username });

    } catch(error){
        console.log('Error: ', error);
        return res.status(500).json({ error: error });
    }
};

export const forgot_password = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).send("An email is required.");

        // Email validation (basic regex pattern for email format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({error: "No account found with the provided email."});
        }

        const existing_otp = await Otp.findOne({email : email});
        if(existing_otp){
            return res.status(200).json({message : "Otp already sent"});
        }
        
        // Send OTP email for password reset
        await send_otp(user.email);
        
        return res.status(200).json({
            message: "Password reset OTP email sent",
            data: {
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: "FAILED", message: "internal server error" });
    }
};



// Verify OTP email function
export const verify_otp = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({error: "Email and OTP are required" });
        }

        // Check password length (e.g., minimum 8 characters)
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }

        // Find OTP records for the user by email
        const userOTPRecords = await Otp.findOne({ email : email });

        if (!userOTPRecords) {
            return res.status(400).json({ error: "Account record doesn't exist" });
        }

        // OTP record exists
        const expiresAt = userOTPRecords.expiresAt;
        const hashedOTP = userOTPRecords.otp;

        if (expiresAt < Date.now()) {
            // OTP has expired
            await Otp.deleteMany({ email });
            return res.status(409).json({ error: "Code has expired. Please request again" });
        }

        // Verify the OTP
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            return res.status(401).json({ error: "Invalid OTP. Please try again." });
        }

        await User.findOneAndUpdate({ email: email }, {password: password});

        await Otp.deleteMany({ email });

        return res.status(200).json({
            message: "Password changed successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internal server error",
        });
    }
};

export const reset_password = async (req,res) => {
    try {
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({error: "All fields are required" });
        }

        const user = await User.findOne({username : req.user.username});

        if (!user) {
            return res.status(409).json({ error: 'User does not exists!'});
        }

        // Check password length (e.g., minimum 8 characters)
        if (new_password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }
        
        if(user.password !== old_password){
            return res.status(400).json({ error: 'Password does not match' });
        }

        user.password = new_password;

        await user.save();

        return res.status(200).json({
            message: "Password has been changed"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internal server error",
        });
    }
}