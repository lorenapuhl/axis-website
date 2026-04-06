// app/api/contact/route.ts
//
// Server-side API route (Next.js App Router).
// NO "use client" — this runs only on the server, never in the browser.
//
// Receives a POST request from the contact form in AboutmeSection.tsx
// containing email, WhatsApp number, and message, then forwards a
// formatted HTML email to the owner via Resend (resend.com).
//
// Resend is called via native fetch — no npm package required.
// API key and owner email are read from environment variables only —
// never hardcoded. See .env.local (local dev) and your Vercel env settings.

import { NextRequest, NextResponse } from 'next/server'

// ─── Request payload shape ────────────────────────────────────────────────────
// This interface is the contract between the contact form (client) and this
// route (server). All three fields are required — the client validates first,
// and the server validates again as a safety net.
interface ContactPayload {
  email: string
  whatsapp: string
  message: string
}

// ─── HTML escaping ────────────────────────────────────────────────────────────
// Escapes user-submitted text before embedding it in the email HTML.
// Prevents unintended HTML injection in the email body.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── HTML email builder ───────────────────────────────────────────────────────
// Builds a clean, readable HTML email using only inline styles —
// email clients strip <style> blocks, so all styling must be inline.
// Format is consistent with the send-lead route email style.
function buildEmailHtml(p: ContactPayload): string {

  // Format the current timestamp for the email header
  const sentAt = new Date().toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
  })

  // Helper: render one info row (bold label + value)
  const row = (label: string, value: string) =>
    `<p style="margin:0 0 8px 0;font-size:14px;color:#333;">
       <strong style="color:#111;">${label}:</strong> ${value}
     </p>`

  // Helper: render one content section with an Electric Blue (#0033FF) left-border heading
  const section = (title: string, content: string) =>
    `<div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-bottom:16px;">
       <h2 style="margin:0 0 12px 0;font-size:13px;font-weight:700;text-transform:uppercase;
                  letter-spacing:0.08em;color:#0033FF;border-left:2px solid #0033FF;
                  padding-left:10px;">
         ${title}
       </h2>
       ${content}
     </div>`

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
    </head>
    <body style="margin:0;padding:0;background:#e8e8e8;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0"
             style="background:#e8e8e8;padding:24px 0;">
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
                    New contact from AXIS website
                  </p>
                  <p style="margin:6px 0 0;font-size:12px;color:#888888;">${sentAt}</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:24px 28px;">

                  ${section('Contact', `
                    ${row('Email', `<a href="mailto:${escapeHtml(p.email)}" style="color:#0033FF;">${escapeHtml(p.email)}</a>`)}
                    ${row('WhatsApp', escapeHtml(p.whatsapp))}
                  `)}

                  ${section('Message', `
                    <p style="margin:0;font-size:14px;color:#333;white-space:pre-wrap;line-height:1.6;">
                      ${escapeHtml(p.message)}
                    </p>
                  `)}

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f0f0f0;padding:16px 28px;border-top:1px solid #e0e0e0;">
                  <p style="margin:0;font-size:11px;color:#999999;">
                    Sent automatically by Axis contact form
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `.trim()
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse the JSON body from the contact form
    const payload: ContactPayload = await request.json()

    // 2. Server-side validation — all three fields are required
    if (!payload.email || !payload.whatsapp || !payload.message) {
      return NextResponse.json(
        { error: 'Missing required fields: email, whatsapp, message' },
        { status: 400 }
      )
    }

    // 3. Read environment variables — never hardcoded
    const apiKey = process.env.RESEND_API_KEY
    const ownerEmail = process.env.OWNER_EMAIL

    if (!apiKey || !ownerEmail) {
      console.error('Missing RESEND_API_KEY or OWNER_EMAIL env vars')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // 4. Build the HTML email body
    const html = buildEmailHtml(payload)

    // 5. POST to the Resend API using native fetch — no SDK, no npm install
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Axis Contact <onboarding@resend.dev>', // Resend free sandbox sender
        to: [ownerEmail],
        subject: 'New contact from AXIS website',
        html,
      }),
    })

    // 6. If Resend returns a non-2xx status, surface the error
    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text()
      console.error('Resend API error:', resendResponse.status, errorBody)
      return NextResponse.json({ error: 'Email failed' }, { status: 500 })
    }

    // 7. Success — the client will transition to the confirmation state
    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    // Catch-all — the route never throws unhandled errors to the client
    console.error('contact route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
