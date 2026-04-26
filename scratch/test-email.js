import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function runTest() {
  console.log('🚀 Starting SMTP Test (ESM Mode)...');

  try {
    // 1. Decode Password
    if (!process.env.SMTP_PASS_B64) {
      throw new Error('SMTP_PASS_B64 not found in .env');
    }
    const smtpPass = Buffer.from(process.env.SMTP_PASS_B64, 'base64').toString();
    console.log('✅ Password decoded successfully.');

    // 2. Initialize Transporter
    const transporter = nodemailer.createTransport({
      host: 'mail.spacemail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'support@minigoatworld.com',
        pass: smtpPass
      }
    });

    // 3. Verify Connection
    console.log('⏳ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection verified!');

    // 4. Send Test Email
    console.log('⏳ Sending test email...');
    const info = await transporter.sendMail({
      from: '"MiniGoat Test" <support@minigoatworld.com>',
      to: 'support@minigoatworld.com',
      subject: '🧪 MiniGoat Test: ESM Engine Check',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0F1C11;">SMTP Test Successful</h2>
          <p>This email confirms that the <strong>Nodemailer</strong> engine is correctly configured using modern ES Modules.</p>
          <hr/>
          <p style="font-size: 12px; color: #718096;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);

  } catch (error) {
    console.error('❌ Test Failed:');
    console.error(error.message);
    process.exit(1);
  }
}

runTest();
