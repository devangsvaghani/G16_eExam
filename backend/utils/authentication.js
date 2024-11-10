import {password_reset_templet} from "./mailTemplets.js"
import {transporter} from "../config/nodemailer.js"
import Otp from "../models/otp.js"
import bcrypt from 'bcrypt';

export const generate_otp = () => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;   

    return otp;
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
