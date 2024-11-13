import {password_reset_templet} from "./mailTemplets.js"
import {transporter} from "../config/nodemailer.js"
import Otp from "../models/otp.js"
import bcrypt from 'bcrypt';

export const generate_otp = () => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;   

    return otp;
}

// Generate 8 length random password
export const generate_password = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

export const generate_student_id = (batch, programType, studentNo) => {
    const typeCode = programType === 'UG' ? '0' : '1';
    const studentNumber = studentNo.toString().padStart(4, '0'); // Ensure it's 4 digits
    return `${batch}${typeCode}${studentNumber}`;
}

export const send_otp = async (email) => {
    try{
        
        const otp = generate_otp();
        
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Password Reset OTP",
            html: password_reset_templet(otp)
        };
        
        // Hash the OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Save OTP to database
        const otpRecord = new Otp({
            email: email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000  // 10 minutes
        });

        await otpRecord.save();

        await transporter.sendMail(mailOptions);
        
    }
    catch (error){
        // console.log(error)
        throw error
    }
    
}