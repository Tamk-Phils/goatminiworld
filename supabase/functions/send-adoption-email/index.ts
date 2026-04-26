import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'new_submission' | 'status_update';
  email: string;
  name: string;
  status?: string;
  goatName: string;
  details?: {
    phone?: string;
    experience?: string;
    motivation?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body: EmailRequest = await req.json()
    const { type, email, name, status, goatName, details } = body;
    
    const client = new SmtpClient()
    
    const host = Deno.env.get('SPACEMAIL_HOST') || 'mail.spacemail.com';
    const user = Deno.env.get('SPACEMAIL_USER') || '';
    const pass = Deno.env.get('SPACEMAIL_PASS') || '';

    await client.connectTLS({
      hostname: host,
      port: 465,
      username: user,
      password: pass,
    })

    let subject = '';
    let html = '';

    if (type === 'new_submission') {
      subject = `🚨 New Adoption Request: ${name} for ${goatName}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2D3748;">New Heritage Sponsorship Request</h2>
          <p><strong>Goat:</strong> ${goatName}</p>
          <p><strong>Applicant:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${details?.phone || 'N/A'}</p>
          <p><strong>Experience:</strong> ${details?.experience || 'N/A'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Motivation:</strong><br/>${details?.motivation || 'N/A'}</p>
          <p style="color: #718096; font-size: 12px; margin-top: 30px;">
            <em>Tip: Use the applicant's email address to reply directly.</em>
          </p>
        </div>
      `;
    } else {
      const isApproved = status === 'approved';
      subject = isApproved ? `Approved! Your request for ${goatName}` : `Update regarding your application for ${goatName}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: ${isApproved ? '#2F855A' : '#2D3748'};">Application Update</h2>
          <p>Hello ${name},</p>
          <p>Your adoption application for <strong>${goatName}</strong> has been <strong>${status?.toUpperCase()}</strong>.</p>
          ${isApproved 
            ? `<p>We are thrilled to welcome you to the heritage preservation family! Please check your dashboard for next steps.</p>`
            : `<p>Thank you for your interest in our heritage herd. We encourage you to explore our other available goats.</p>`
          }
          <p style="margin-top: 30px;">Best regards,<br/>MiniGoat World Team</p>
        </div>
      `;
    }

    await client.send({
      from: user,
      to: type === 'new_submission' ? user : email,
      subject: subject,
      content: html,
      html: html,
    })

    await client.close()

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  }
})
