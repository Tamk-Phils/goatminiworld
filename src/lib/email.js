/**
 * Robust Email Utility using Formspree
 * This is the final, rock-solid solution that bypasses all SMTP and CORS restrictions.
 */
export async function sendAdoptionEmail({ type, email, name, status, goatName, details = {} }) {
  const FORMSPREE_URL = "https://formspree.io/f/xbdqerqr";
  
  const isSubmission = type === 'new_submission';
  
  const payload = {
    _subject: isSubmission ? `🚨 New Request: ${name} for ${goatName}` : `Update: Your request for ${goatName}`,
    type: type,
    name: name,
    email: email,
    goat_name: goatName,
    status: status || 'pending',
    phone: details.phone || 'N/A',
    experience: details.experience || 'N/A',
    motivation: details.motivation || 'N/A',
    message: isSubmission 
      ? `New application received for ${goatName}.` 
      : `Your application for ${goatName} has been ${status?.toUpperCase()}.`
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

    if (!response.ok) throw new Error('Formspree request failed');
    console.log('Email sent via Formspree successfully!');
    return true;
  } catch (error) {
    console.error('Formspree failed:', error);
    throw error;
  }
}
