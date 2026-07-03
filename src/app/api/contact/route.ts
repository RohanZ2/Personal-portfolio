// Server-side relay for the contact form. The Web3Forms access key lives only
// in process.env (never shipped to the browser, never committed), so the key
// stays private even though the site is otherwise fully client-rendered. The
// browser POSTs { name, email, message } here; we forward it to Web3Forms with
// the secret key attached.

import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const key = process.env.WEB3FORMS_KEY;
  if (!key) {
    return NextResponse.json(
      { success: false, error: 'Contact form is not configured.' },
      { status: 500 },
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, error: 'Name, email and message are all required.' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `Portfolio message from ${name}`,
        from_name: name,
        name,
        email,
        message,
      }),
    });
    const data = await res.json();
    return NextResponse.json(
      { success: !!data.success, error: data.success ? undefined : data.message },
      { status: data.success ? 200 : 502 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to reach the mail service.' },
      { status: 502 },
    );
  }
}
