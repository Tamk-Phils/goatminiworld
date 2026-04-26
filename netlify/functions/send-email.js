import nodemailer from 'nodemailer';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { type, email, name, status, goatName, details } = JSON.parse(event.body);
    
    // Decode password (Attkisson Approach)
    if (!process.env.SMTP_PASS_B64) {
      throw new Error('SMTP_PASS_B64 not found in environment');
    }
    const smtpPass = Buffer.from(process.env.SMTP_PASS_B64, 'base64').toString();

    const transporter = nodemailer.createTransport({
      host: 'mail.spacemail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'support@minigoatworld.com',
        pass: smtpPass
      }
    });

    const isSubmission = type === 'new_submission';
    const isApproved = status === 'approved';

    const title = isSubmission ? "New Heritage Sponsorship Request" : "Application Status Update";
    const mainText = isSubmission 
      ? `A new sponsorship application has been received for <strong>${goatName}</strong>.`
      : `Hello ${name}, your application for <strong>${goatName}</strong> has been <strong>${status?.toUpperCase()}</strong>.`;

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #0F1C11; padding: 30px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase;">MiniGoat World</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #2d3748; font-size: 20px;">${title}</h2>
          <p style="color: #4a5568; line-height: 1.6;">${mainText}</p>
          <div style="background-color: #f7fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 20px 0;">
            ${isSubmission ? `
              <p style="margin: 5px 0;"><strong>Applicant:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 15px 0 5px 0;"><strong>Motivation:</strong></p>
              <p style="margin: 0; color: #718096; font-style: italic;">"${details?.motivation || 'N/A'}"</p>
            ` : `
              <p style="margin: 0;">${isApproved 
                ? "Welcome to the family! Please log in to your dashboard for next steps." 
                : "Thank you for your interest. We encourage you to explore our other goats."}</p>
            `}
          </div>
          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 30px;">
            &copy; 2024 MiniGoat World Heritage Sanctuary
          </p>
        </div>
      </div>
    `;

    // 1. Send to Admin (Alert)
    if (isSubmission) {
      await transporter.sendMail({
        from: '"MiniGoat Admin" <support@minigoatworld.com>',
        to: 'support@minigoatworld.com',
        replyTo: email,
        subject: `🚨 New Request: ${name}`,
        html: htmlBody
      });
    }

    // 2. Send to User (Confirmation)
    await transporter.sendMail({
      from: '"MiniGoat World" <support@minigoatworld.com>',
      to: email,
      subject: isSubmission ? `We received your request!` : `Application Update: ${status}`,
      html: htmlBody
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Emails sent successfully' })
    };
  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
