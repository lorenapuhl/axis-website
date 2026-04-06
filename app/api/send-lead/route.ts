// app/api/send-lead/route.ts
//
// Server-side API route (Next.js App Router).
// NO "use client" — this runs only on the server, never in the browser.
//
// Receives a POST request from Step3.tsx with the full lead payload,
// then forwards a formatted HTML email to the owner via Resend (resend.com).
//
// Resend is called via native fetch — no npm package required.
// API key and owner email are read from environment variables only —
// never hardcoded. See .env.local and .env.example.

import { NextRequest, NextResponse } from 'next/server';

// ─── Request payload shape ────────────────────────────────────────────────────
// This interface is the contract between Step3.tsx (client) and this route (server).
// Every field maps to a user answer collected across the 3-step CTA flow.
interface LeadPayload {
  // Contact (collected in Step 3 contact form)
  email: string;
  whatsapp: string;

  // Step 1
  handle: string;
  studioType: string;
  location: string;
  problems: string[];   // human-readable labels, not raw indices
  goals: string[];      // human-readable labels, not raw indices

  // Step 2
  vibe: string;
  activeFeatures: string[]; // human-readable feature labels, not raw indices
  uploadedImageCount: number; // count only — base64 data is never sent over email

  // Meta
  submittedAt: string; // ISO timestamp from the client
}

// ─── HTML email builder ───────────────────────────────────────────────────────
// Builds a clean, readable HTML email as a template literal.
// Uses ONLY inline styles — email clients strip <style> blocks.
// Max width 600px, sans-serif font, light-grey section cards, Electric Blue accents.
function buildEmailHtml(p: LeadPayload): string {
  // Format the ISO timestamp into a human-readable string
  const formattedDate = new Date(p.submittedAt).toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // Helper: render a bulleted <ul> list from a string array.
  // Returns a placeholder if the array is empty.
  const bulletList = (items: string[], emptyText = 'None selected') =>
    items.length === 0
      ? `<p style="margin:0;color:#666;font-size:14px;">${emptyText}</p>`
      : `<ul style="margin:0;padding-left:20px;">
          ${items.map((item) => `<li style="color:#333;font-size:14px;margin-bottom:4px;">${item}</li>`).join('')}
        </ul>`;

  // Helper: render one info row (label + value).
  const row = (label: string, value: string) =>
    `<p style="margin:0 0 8px 0;font-size:14px;color:#333;">
       <strong style="color:#111;">${label}:</strong> ${value}
     </p>`;

  // Helper: render one content section with a blue left-border heading.
  const section = (title: string, content: string) =>
    `<div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-bottom:16px;">
       <h2 style="margin:0 0 12px 0;font-size:13px;font-weight:700;text-transform:uppercase;
                  letter-spacing:0.08em;color:#0033FF;border-left:2px solid #0033FF;
                  padding-left:10px;">
         ${title}
       </h2>
       ${content}
     </div>`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
    <body style="margin:0;padding:0;background:#e8e8e8;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8e8e8;padding:24px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                   style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;
                          overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background:#000000;padding:24px 28px;">
                  <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;
                             letter-spacing:0.05em;">
                    New studio lead via Axis
                  </p>
                  <p style="margin:6px 0 0;font-size:12px;color:#888888;">${formattedDate}</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:24px 28px;">

                  ${section('Contact', `
                    ${row('Email', `<a href="mailto:${p.email}" style="color:#0033FF;">${p.email}</a>`)}
                    ${row('WhatsApp', p.whatsapp)}
                  `)}

                  ${section('Studio', `
                    ${row('Name / Handle', p.handle || '—')}
                    ${row('Type', p.studioType || '—')}
                    ${row('Location', p.location || '—')}
                  `)}

                  ${section('Their problems', bulletList(p.problems))}

                  ${section('Their goals', bulletList(p.goals))}

                  ${section('Website preferences', `
                    ${row('Vibe', p.vibe || '—')}
                    <p style="margin:0 0 8px 0;font-size:14px;color:#111;font-weight:700;">
                      Features requested:
                    </p>
                    ${bulletList(p.activeFeatures)}
                    <p style="margin:12px 0 0;font-size:14px;color:#333;">
                      <strong style="color:#111;">Photos uploaded:</strong> ${p.uploadedImageCount}
                    </p>
                  `)}

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f0f0f0;padding:16px 28px;border-top:1px solid #e0e0e0;">
                  <p style="margin:0;font-size:11px;color:#999999;">
                    Sent automatically by Axis CTA flow
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `.trim();
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse the JSON body sent by Step3.tsx
    const payload: LeadPayload = await request.json();

    // 2. Validate required contact fields — return 400 if missing
    if (!payload.email || !payload.whatsapp) {
      return NextResponse.json(
        { error: 'Missing required fields: email and whatsapp' },
        { status: 400 }
      );
    }

    // 3. Read environment variables — never hardcoded
    const apiKey = process.env.RESEND_API_KEY;
    const ownerEmail = process.env.OWNER_EMAIL;

    if (!apiKey || !ownerEmail) {
      console.error('Missing RESEND_API_KEY or OWNER_EMAIL env vars');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 4. Build email subject and HTML body
    const subject = `New lead: ${payload.handle || 'Unknown'} — ${payload.studioType || 'Studio'} in ${payload.location || 'Unknown location'}`;
    const html = buildEmailHtml(payload);

    // 5. POST to Resend API using native fetch — no SDK, no npm install
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Axis CTA <onboarding@resend.dev>', // Resend's free sandbox sender
        to: [ownerEmail],
        subject,
        html,
      }),
    });

    // 6. If Resend returns a non-2xx status, return 500
    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, errorBody);
      return NextResponse.json({ error: 'Email failed' }, { status: 500 });
    }

    // 7. Success
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    // Catch-all — the route never throws unhandled errors
    console.error('send-lead route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
