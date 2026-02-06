// import sgMail from "@sendgrid/mail";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// export async function sendVerificationCode(email: string, code: string) {
//   await sgMail.send({
//     to: email,
//     from: process.env.EMAIL_FROM!,
//     subject: "Your AssetWeave verification code",
//     html: `
//       <div style="font-family:sans-serif">
//         <h2>AssetWeave Login Verification</h2>
//         <p>Your verification code:</p>
//         <h1>${code}</h1>
//         <p>This code expires in 5 minutes.</p>
//       </div>
//     `,
//   });
// }

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationCode(email: string, code: string) {
  await transporter.sendMail({
    from: `"AssetWeave" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your verification code",
    text: `Your code is: ${code}`,
  });
}