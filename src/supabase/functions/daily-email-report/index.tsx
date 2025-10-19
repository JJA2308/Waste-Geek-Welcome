import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from '../server/kv_store.tsx';

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get current timestamp
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    console.log(`Checking for waitlist entries between ${yesterday.toISOString()} and ${now.toISOString()}`);
    
    // Get all waitlist entries
    const allEntries = await kv.getByPrefix('waitlist:');
    
    if (!allEntries || allEntries.length === 0) {
      console.log('No waitlist entries found in database. No email will be sent.');
      return new Response(JSON.stringify({ message: 'No entries to report' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`Total waitlist entries in database: ${allEntries.length}`);

    // Filter entries from the last 24 hours
    const recentEntries = allEntries.filter(entry => {
      const entryTime = new Date(entry.timestamp);
      return entryTime >= yesterday && entryTime <= now;
    });

    console.log(`Entries from last 24 hours: ${recentEntries.length}`);

    if (recentEntries.length === 0) {
      console.log('No new waitlist entries in the last 24 hours. No email will be sent.');
      return new Response(JSON.stringify({ message: 'No new entries in the last 24 hours' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Group by user type
    const customers = recentEntries.filter(e => e.userType === 'customer');
    const haulers = recentEntries.filter(e => e.userType === 'hauler');
    const brokers = recentEntries.filter(e => e.userType === 'broker');

    console.log(`Breakdown - Customers: ${customers.length}, Haulers: ${haulers.length}, Brokers: ${brokers.length}`);

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #155dfc; border-bottom: 2px solid #155dfc; padding-bottom: 10px; }
            h2 { color: #4a5565; margin-top: 25px; }
            .summary { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .section { margin: 20px 0; }
            ul { list-style: none; padding: 0; }
            li { padding: 8px; margin: 5px 0; background: #fff; border-left: 3px solid #155dfc; padding-left: 15px; }
            .count { font-weight: bold; color: #155dfc; font-size: 1.2em; }
            .timestamp { color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Waste Geek Daily Waitlist Report</h1>
            
            <div class="summary">
              <p><strong>Report Period:</strong> ${yesterday.toLocaleString()} - ${now.toLocaleString()}</p>
              <p><strong>Total New Signups:</strong> <span class="count">${recentEntries.length}</span></p>
            </div>

            <div class="section">
              <h2>Customers <span class="count">(${customers.length})</span></h2>
              ${customers.length > 0 ? `
                <ul>
                  ${customers.map(c => `<li>${c.email} <span class="timestamp">- ${new Date(c.timestamp).toLocaleString()}</span></li>`).join('')}
                </ul>
              ` : '<p>No new customers</p>'}
            </div>

            <div class="section">
              <h2>Haulers <span class="count">(${haulers.length})</span></h2>
              ${haulers.length > 0 ? `
                <ul>
                  ${haulers.map(h => `<li>${h.email} <span class="timestamp">- ${new Date(h.timestamp).toLocaleString()}</span></li>`).join('')}
                </ul>
              ` : '<p>No new haulers</p>'}
            </div>

            <div class="section">
              <h2>Brokers <span class="count">(${brokers.length})</span></h2>
              ${brokers.length > 0 ? `
                <ul>
                  ${brokers.map(b => `<li>${b.email} <span class="timestamp">- ${new Date(b.timestamp).toLocaleString()}</span></li>`).join('')}
                </ul>
              ` : '<p>No new brokers</p>'}
            </div>

            <div class="summary" style="margin-top: 30px;">
              <p style="margin: 0; font-size: 0.9em; color: #666;">
                This is an automated daily report from Waste Geek waitlist system.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ error: 'Email service not configured - RESEND_API_KEY missing' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('Sending email via Resend...');

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Waste Geek <onboarding@resend.dev>',
        to: ['wastegeek.com@gmail.com'],
        subject: `Waste Geek Daily Report - ${recentEntries.length} New Signup${recentEntries.length !== 1 ? 's' : ''}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Failed to send email via Resend:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: errorData }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const emailData = await emailResponse.json();
    console.log('Daily report email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        entriesReported: recentEntries.length,
        breakdown: {
          customers: customers.length,
          haulers: haulers.length,
          brokers: brokers.length,
        },
        emailId: emailData.id 
      }), 
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in daily email report function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }), 
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
