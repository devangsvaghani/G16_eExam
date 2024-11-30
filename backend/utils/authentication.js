import {password_reset_templet} from "./mailTemplets.js"
import {transporter} from "../config/nodemailer.js"

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

export const send_otp = async (email, otp) => {
    try{
        
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Password Reset OTP",
            html: password_reset_templet(otp)
        };

        await transporter.sendMail(mailOptions);
        
    }
    catch (error){
        console.log(error)
        throw error
    }
    
}

export const send_mail = async (email, subject, html) => {
    try{
        
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
        
    }
    catch (error){
        console.log(error)
        throw error
    }
    
}
