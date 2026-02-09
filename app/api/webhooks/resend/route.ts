import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log('📨 Webhook received:', JSON.stringify(body, null, 2));

        // Resend webhook events we care about
        const eventType = body.type;

        // Handle email.received event (when someone replies to your campaign)
        if (eventType === 'email.received') {
            console.log('✉️ Inbound email received from:', body.data.from);

            const replyFrom = body.data.from[0]; // Email address of person who replied (array)
            const originalSubject = body.data.subject || 'Your inquiry';
            const messageId = body.data.message_id; // Message ID for threading

            // Send auto-response with Calendly link
            const calendlyLink = process.env.CALENDLY_LINK || 'https://calendly.com/yourlink';
            const yourName = process.env.YOUR_NAME || 'Srinivas';

            // Build proper threading headers for reply
            // We must reference the original message ID in In-Reply-To
            const headers: Record<string, string> = {
                'In-Reply-To': messageId,
            };

            // If previous references exist, append the original message ID
            // This maintains the thread history
            if (body.data.references) {
                headers['References'] = `${body.data.references} ${messageId}`;
            } else {
                headers['References'] = messageId;
            }

            const { error } = await resend.emails.send({
                from: process.env.EMAIL_ADDRESS || 'onboarding@resend.dev',
                to: replyFrom,
                subject: originalSubject.startsWith('Re:') ? originalSubject : `Re: ${originalSubject}`,
                headers,
                html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
            <p>Hi there! 👋</p>
            
            <p>Thank you for your email! I'd love to discuss this further with you.</p>
            
            <p>Please use the link below to schedule a convenient time for us to meet:</p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${calendlyLink}" 
                 style="background: #ff6b35; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                📅 Schedule a Meeting
              </a>
            </div>
            
            <p>Looking forward to connecting with you!</p>
            
            <p>Best regards,<br>${yourName}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #888;">
              This is an automated response to your message. If you prefer to contact me directly, 
              please reply to this email and I'll get back to you personally.
            </p>
          </div>
        `,
                text: `Hi there!

Thank you for your email! I'd love to discuss this further with you.

Please use the link below to schedule a convenient time for us to meet:
${calendlyLink}

Looking forward to connecting with you!

Best regards,
${yourName}

---
This is an automated response to your message. If you prefer to contact me directly, please reply to this email and I'll get back to you personally.`,
            });

            if (error) {
                console.error('❌ Failed to send auto-reply:', error);
                return Response.json({ error: 'Failed to send auto-reply' }, { status: 500 });
            }

            console.log('✅ Auto-reply sent to:', replyFrom);
            return Response.json({ success: true, message: 'Auto-reply sent' });
        }

        // Log other webhook events
        console.log(`ℹ️ Received ${eventType} event`);
        return Response.json({ success: true, message: 'Webhook received' });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return Response.json(
            { error: error instanceof Error ? error.message : 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
