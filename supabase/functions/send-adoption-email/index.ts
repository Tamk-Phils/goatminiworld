import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { type, email, name, status, goatName, details } = await req.json()
    const client = new SmtpClient()
    
    await client.connectTLS({
      hostname: Deno.env.get('SPACEMAIL_HOST') || 'mail.spacemail.com',
      port: 465,
      username: Deno.env.get('SPACEMAIL_USER')!,
      password: Deno.env.get('SPACEMAIL_PASS')!,
    })

    let mailOptions;

    if (type === 'new_submission') {
      // EMAIL TO ADMIN
      mailOptions = {
        from: Deno.env.get('SPACEMAIL_USER')!,
        to: Deno.env.get('SPACEMAIL_USER')!, // Admin receives it
        replyTo: email, // ADMIN CAN REPLY DIRECTLY TO USER
        subject: `🚨 New Adoption Request: ${name} for ${goatName}`,
        content: `New application received for ${goatName}.\n\nName: ${name}\nEmail: ${email}\nPhone: ${details.phone}\nExperience: ${details.experience}\n\nMotivation: ${details.motivation}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2D3748;">New Heritage Sponsorship Request</h2>
            <p><strong>Goat:</strong> ${goatName}</p>
            <p><strong>Applicant:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${details.phone}</p>
            <p><strong>Experience:</strong> ${details.experience}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p><strong>Motivation:</strong><br/>${details.motivation}</p>
            <p style="color: #718096; font-size: 12px; margin-top: 30px;">
              <em>Tip: You can reply directly to this email to contact the applicant.</em>
            </p>
          </div>
        `,
      }
    } else {
      // EMAIL TO USER (Status Update)
      const isApproved = status === 'approved';
      mailOptions = {
        from: Deno.env.get('SPACEMAIL_USER')!,
        to: email,
        subject: isApproved ? `Approved! Your request for ${goatName}` : `Update regarding your application for ${goatName}`,
        content: `Your application for ${goatName} has been ${status}.`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: ${isApproved ? '#2F855A' : '#2D3748'};">Application Update</h2>
            <p>Hello ${name},</p>
            <p>Your adoption application for <strong>${goatName}</strong> has been <strong>${status.toUpperCase()}</strong>.</p>
            ${isApproved 
              ? `<p>We are thrilled to welcome you to the heritage preservation family! Please check your dashboard for next steps.</p>`
              : `<p>Thank you for your interest in our heritage herd. We encourage you to explore our other available goats.</p>`
            }
            <p style="margin-top: 30px;">Best regards,<br/>MiniGoat World Team</p>
          </div>
        `,
      }
    }

    await client.send(mailOptions)
    await client.close()

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  }
})
