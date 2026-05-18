//import nodemailer from 'nodemailer';
//import { Mailer } from './notification';

//export function createSmtpMailer(): Mailer {
//    const transporter = nodemailer.createTransport({
//        host: process.env.SMTP_HOST,
//        port: Number(process.env.SMTP_PORT || 587),
//        secure: process.env.SMTP_SECURE === 'true',
//        auth: {
//            user: process.env.SMTP_USER,
//            pass: process.env.SMTP_PASS,
//        },
//    });
//    console.log("mailer - createSmtpMailer - transporter: " + transporter)
//    return {
//        async send(to, subject, text, html) {
//            await transporter.sendMail({
//                from: process.env.MAIL_FROM || '"TEMENOX" <noreply@yourapp.com>',
//                to,
//                subject,
//                text,
//                html: html || `<pre>${text}</pre>`,
//            });
//        },
//    };
//}