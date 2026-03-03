import * as nodemailer from "nodemailer";


export async function sendMail(mail: string, subject:string, content: string) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SMTP,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_SENDFROM}>`,
        to: mail,
        subject: subject,
        html: content,
    });
}