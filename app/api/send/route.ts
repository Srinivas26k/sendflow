import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, subject, template, firstName, title } = await request.json();

    if (!to || !subject || !template) {
      return Response.json(
        { error: 'Missing required fields: to, subject, template' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        { error: 'RESEND_API_KEY is not configured' },
        { status: 500 }
      );
    }

    let htmlContent = '';

    if (template === 'welcome') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .card { background: white; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
              h1 { color: #1a1f2e; font-size: 28px; margin: 0 0 16px 0; }
              p { color: #475569; line-height: 1.6; margin: 0 0 16px 0; }
              .button { background: #ff6b35; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 500; }
              .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 40px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <h1>Welcome, ${firstName || 'there'}! 👋</h1>
                <p>Thank you for joining SendFlow. We're excited to have you on board.</p>
                <p>With SendFlow, you can send beautiful, professional emails at scale using the power of Resend.</p>
                <p style="margin: 32px 0;">
                  <a href="#" class="button">Get Started</a>
                </p>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The SendFlow Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 SendFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
    } else if (template === 'notification') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .card { background: white; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #ff6b35 0%, #ffa45b 100%); color: white; padding: 24px; border-radius: 6px; margin-bottom: 24px; }
              .header h1 { margin: 0; font-size: 24px; }
              h2 { color: #1a1f2e; font-size: 20px; margin: 0 0 12px 0; }
              p { color: #475569; line-height: 1.6; margin: 0 0 16px 0; }
              .highlight { background: #fef3c7; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #fbbf24; }
              .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 40px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="header">
                  <h1>${title || 'Important Update'}</h1>
                </div>
                <p>Hello ${firstName || 'there'},</p>
                <p>We wanted to let you know about an important update.</p>
                <div class="highlight">
                  <strong>Update:</strong> Your account has been successfully set up and is ready to use!
                </div>
                <p>You can now start sending professional emails through SendFlow immediately.</p>
                <p>Thank you for your attention!</p>
                <p>Best regards,<br>The SendFlow Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 SendFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
    }

    const { data, error } = await resend.emails.send({
      from: 'SendFlow <noreply@sendflow.app>',
      to,
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'Email sent successfully',
      data,
    });
  } catch (error) {
    console.error('Send email error:', error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send email',
      },
      { status: 500 }
    );
  }
}
