// This simulates what Resend would send if you had a custom domain receiving emails
async function testWebhook() {
    const webhookUrl = 'https://sendflow-omega.vercel.app/api/webhooks/resend';

    // Fake payload for an inbound email reply
    const payload = {
        type: 'email.received',
        created_at: new Date().toISOString(),
        data: {
            from: ['srinivasnampalli2004@gmail.com'],
            to: ['srinivas@yourdomain.com'],
            subject: 'Re: Quick question about YourCompany',
            message_id: 'fake_message_id_12345',
            references: '<original_message_id_67890>',
            text: 'Yes, I would love to meet! When are you free?',
            html: '<p>Yes, I would love to meet! When are you free?</p>'
        }
    };

    console.log('🚀 Sending fake "email.received" event to:', webhookUrl);

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('Response Status:', response.status);

        if (response.ok) {
            console.log('✅ Webhook processed successfully!');
            console.log('You should receive an auto-reply at srinivasnampalli2004@gmail.com shortly.');
        } else {
            console.log('❌ Webhook failed:', await response.text());
        }
    } catch (error) {
        console.error('❌ Error testing webhook:', error);
    }
}

testWebhook();
