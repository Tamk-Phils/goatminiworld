/**
 * Premium Email Utility using Formspree
 * Custom formatted for a beautiful, organized inbox experience.
 */
export async function sendAdoptionEmail({ type, email, name, status, goatName, details = {} }) {
  const FORMSPREE_URL = "https://formspree.io/f/mlgakrqj";
  
  const isSubmission = type === 'new_submission';
  
  // Custom formatted message for a "Beautiful" look in the inbox
  const customMessage = isSubmission 
    ? `
--------------------------------------------------
🐐 NEW HERITAGE SPONSORSHIP REQUEST
--------------------------------------------------
Goat: ${goatName}
Applicant: ${name}
Email: ${email}
Phone: ${details.phone || 'N/A'}
Experience: ${details.experience || 'N/A'}

MOTIVATION:
"${details.motivation || 'N/A'}"
--------------------------------------------------
    `
    : `
--------------------------------------------------
✨ APPLICATION STATUS UPDATE
--------------------------------------------------
Hello ${name},

Your application for ${goatName} has been ${status?.toUpperCase()}.

${status === 'approved' 
  ? "Welcome to the heritage preservation family! Check your dashboard for next steps." 
  : "Thank you for your interest. We encourage you to explore our other goats."}
--------------------------------------------------
    `;

  const payload = {
    _subject: isSubmission ? `🚨 New Request: ${name}` : `Update: ${goatName} Application`,
    _template: "table", // Formspree will use a clean table layout
    name: name,
    email: email,
    goat: goatName,
    status: status || 'pending',
    custom_formatted_message: customMessage,
  };

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Formspree failed');
    return true;
  } catch (error) {
    console.error('Email failed:', error);
    throw error;
  }
}
