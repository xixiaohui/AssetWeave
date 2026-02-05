import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendVerificationCode(email: string, code: string) {
  await sgMail.send({
    to: email,
    from: process.env.EMAIL_FROM!,
    subject: "Your AssetWeave verification code",
    html: `
      <div style="font-family:sans-serif">
        <h2>AssetWeave Login Verification</h2>
        <p>Your verification code:</p>
        <h1>${code}</h1>
        <p>This code expires in 5 minutes.</p>
      </div>
    `,
  });
}
