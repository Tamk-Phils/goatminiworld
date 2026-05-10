/**
 * Attkisson-style Email Service Utility
 * Calls the internal Netlify Function API.
 */
export const emailService = {
  async sendEmail(data) {
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Handle case where Netlify function is not running (e.g. standard npm run dev)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn('Email function not responding with JSON. This is normal if you are not running "netlify dev".');
        return { message: 'Skipped email (Offline)' };
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Email error');
      return result;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  },

  async notifyNewSubmission(name, email, goatName, motivation, message) {
    return this.sendEmail({
      type: 'new_submission',
      name,
      email,
      goatName,
      details: { motivation, message }
    });
  },

  async notifyStatusUpdate(name, email, goatName, status) {
    return this.sendEmail({
      type: 'status_update',
      name,
      email,
      goatName,
      status
    });
  }
};
