import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


export const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT || 587),
secure: false,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS,
},
});


export async function sendLoginLink({ to, link }) {
const info = await transporter.sendMail({
from: process.env.SMTP_FROM,
to,
subject: "Your secure login link",
text: `Click to complete login: ${link}`,
html: `<p>Click to complete login:</p><p><a href="${link}">${link}</a></p>`
});
return info.messageId;
}