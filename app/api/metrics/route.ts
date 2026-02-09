
import { store } from '@/lib/store';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function processQueue() {
    if (store.stats.status !== 'RUNNING') return;

    // Find pending leads
    const pendingLeads = store.leads.filter(l => l.status === 'PENDING').slice(0, 1); // Send 1 per tick for safety in demo

    if (pendingLeads.length === 0) {
        // No more leads, stop campaign
        if (store.leads.length > 0 && store.leads.every(l => l.status !== 'PENDING')) {
            store.stats.status = 'STOPPED';
            store.addLog('Campaign finished: No more pending leads');
        }
        return;
    }

    for (const lead of pendingLeads) {
        try {
            // Check daily limit
            if (store.stats.sent >= store.settings.dailyLimit) {
                store.stats.status = 'PAUSED';
                store.addLog('Daily limit reached. Pausing campaign.');
                return;
            }

            const fromEmail = process.env.EMAIL_ADDRESS || 'onboarding@resend.dev';
            const subject = store.templates.initial.subject.replace('{{first_name}}', lead.data.name || 'there');
            const body = store.templates.initial.body
                .replace('{{first_name}}', lead.data.name || 'there')
                // Basic variable replacement
                .replace(/{{(\w+)}}/g, (_, key) => lead.data[key] || '');

            const { error } = await resend.emails.send({
                from: fromEmail,
                to: lead.email,
                subject: subject || 'Hello',
                html: body || 'Hello',
                text: body || 'Hello'
            });

            if (error) {
                lead.status = 'FAILED';
                store.stats.failed++;
                store.addLog('Failed to send email', lead.email, error);
            } else {
                lead.status = 'SENT';
                lead.last_sent_at = new Date().toISOString();
                store.stats.sent++;
                store.addLog('Email sent', lead.email);
            }
        } catch (e) {
            lead.status = 'FAILED';
            store.stats.failed++;
            console.error(e);
        }
    }
}

export async function GET() {
    // Heartbeat: Try to process queue if running
    if (store.stats.status === 'RUNNING') {
        await processQueue();
    }

    return Response.json({
        sent_today: store.stats.sent,
        replies: store.stats.replies,
        failed: store.stats.failed,
        daily_limit: store.settings.dailyLimit,
        campaign_status: store.stats.status
    });
}
