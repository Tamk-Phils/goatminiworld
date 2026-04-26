const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { type, email, name, status, goatName, details } = JSON.parse(event.body);
    
    // Decode password (Attkisson Approach)
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
          <h2 style="color: #2d3748;">${title}</h2>
          <p style="color: #4a5568;">${mainText}</p>
          <div style="background-color: #f7fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #D4AF37;">
            ${isSubmission ? `
              <p><strong>Applicant:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Motivation:</strong> ${details?.motivation || 'N/A'}</p>
            ` : `
              <p>${isApproved ? "Welcome to the family!" : "Thank you for your interest."}</p>
            `}
          </div>
        </div>
      </div>
    `;

    // 1. Send to Admin
    if (isSubmission) {
      await transporter.sendMail({
        from: '"MiniGoat World" <support@minigoatworld.com>',
        to: 'support@minigoatworld.com',
        replyTo: email,
        subject: `🚨 New Request: ${name}`,
        html: htmlBody
      });
    }

    // 2. Send to User
    await transporter.sendMail({
      from: '"MiniGoat World" <support@minigoatworld.com>',
      to: email,
      subject: isSubmission ? `We received your request!` : `Application Update: ${status}`,
      html: htmlBody
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully' })
    };
  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
