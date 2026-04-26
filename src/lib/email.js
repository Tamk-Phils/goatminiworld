/**
 * Secure Email Utility using SpaceMail SMTP
 * This bypasses the need for Edge Functions while keeping the Admin alert and User notifications active.
 */

export async function sendAdoptionEmail({ type, email, name, status, goatName, details = {} }) {
  const adminEmail = "support@minigoatworld.com";
  
  let subject, body, to, replyTo;

  if (type === 'new_submission') {
    // EMAIL TO ADMIN
    to = adminEmail;
    replyTo = email;
    subject = `🚨 New Adoption Request: ${name} for ${goatName}`;
    body = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2D3748;">New Heritage Sponsorship Request</h2>
        <p><strong>Goat:</strong> ${goatName}</p>
        <p><strong>Applicant:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${details.phone || 'N/A'}</p>
        <p><strong>Experience:</strong> ${details.experience || 'N/A'}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Motivation:</strong><br/>${details.motivation || 'N/A'}</p>
        <p style="color: #718096; font-size: 12px; margin-top: 30px;">
          <em>Tip: You can reply directly to this email to contact the applicant.</em>
        </p>
      </div>
    `;
  } else {
    // EMAIL TO USER (Status Update)
    to = email;
    const isApproved = status === 'approved';
    subject = isApproved ? `Approved! Your request for ${goatName}` : `Update regarding your application for ${goatName}`;
    body = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: ${isApproved ? '#2F855A' : '#2D3748'};">Application Update</h2>
        <p>Hello ${name},</p>
        <p>Your adoption application for <strong>${goatName}</strong> has been <strong>${status.toUpperCase()}</strong>.</p>
        ${isApproved 
          ? `<p>We are thrilled to welcome you to the heritage preservation family! Please check your dashboard for next steps.</p>`
          : `<p>Thank you for your interest in our heritage herd. We encourage you to explore our other available goats.</p>`
        }
        <p style="margin-top: 30px;">Best regards,<br/>MiniGoat World Team</p>
      </div>
    `;
  }

  // SmtpJS call
  return window.Email.send({
    Host: "mail.spacemail.com",
    Username: adminEmail,
    Password: "Phil$787",
    To: to,
    From: adminEmail,
    Subject: subject,
    Body: body,
    ReplyTo: replyTo
  });
}
