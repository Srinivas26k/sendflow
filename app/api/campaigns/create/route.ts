import { parseCSV } from '@/lib/csv';
import { renderTemplate } from '@/lib/placeholder';
import { Resend } from 'resend';
import { v4 as uuid } from 'uuid';
import { updateCampaignStats } from '@/lib/campaign-stats';

const resend = new Resend(process.env.RESEND_API_KEY);

// Test mode: When using Resend's test domain without a verified custom domain,
// only your verified email can receive messages
const TEST_MODE = process.env.TEST_MODE === 'true';
const VERIFIED_EMAIL = process.env.VERIFIED_EMAIL || 'srinivasnampalli2004@gmail.com';

export async function POST(req: Request) {
  try {
    const { subject, body, csvText, csvHeaders } = await req.json();

    if (!subject || !body || !csvText) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { rows } = parseCSV(csvText);
    const campaignId = uuid();

    // Send emails immediately
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const row of rows) {
      try {
        const email = row.email;
        if (!email) continue;

        // In test mode, only send to verified email
        if (TEST_MODE && email.toLowerCase() !== VERIFIED_EMAIL.toLowerCase()) {
          console.log(`[TEST MODE] Skipping ${email} - only sending to ${VERIFIED_EMAIL}`);
          skippedCount++;
          continue;
        }

        const renderedSubject = renderTemplate(subject, row);
        const renderedBody = renderTemplate(body, row);

        const { error } = await resend.emails.send({
          from: process.env.EMAIL_ADDRESS || 'onboarding@resend.dev',
          to: email,
          subject: renderedSubject,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              ${renderedBody
              .split('\n')
              .map((line) => `<p>${line}</p>`)
              .join('')}
            </div>
          `,
        });

        if (error) {
          console.error(`Failed to send to ${email}:`, error);
          errorCount++;
        } else {
          successCount++;
        }

        // Add delay to respect Resend rate limits (2 requests/second on free tier)
        await new Promise(resolve => setTimeout(resolve, 600));
      } catch (err) {
        console.error('Error sending email:', err);
        errorCount++;
      }
    }

    // Track campaign stats
    updateCampaignStats({
      campaignId,
      subject,
      totalLeads: rows.length,
      sent: successCount,
      failed: errorCount,
      skipped: skippedCount,
    });

    return Response.json({
      campaignId,
      totalLeads: rows.length,
      sent: successCount,
      failed: errorCount,
      skipped: skippedCount,
      testMode: TEST_MODE,
      ...(TEST_MODE && { message: `Test mode: Only sending to ${VERIFIED_EMAIL}` }),
    });
  } catch (error) {
    console.error('Campaign creation error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
