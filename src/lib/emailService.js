/**
 * Attkisson-style Email Service Utility
 * Calls the internal Netlify Function API.
 */
export const emailService = {
  async sendEmail(data) {
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send email');
      }

      return await response.json();
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
