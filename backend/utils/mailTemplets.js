export const password_reset_templet = (otp) => {
    return    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Code for Password Reset</title>
    </head>
    <body>
        <p> ${otp} </p>
    </body>
    </html>
    `;

} 

