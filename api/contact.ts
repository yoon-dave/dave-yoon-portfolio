import type { IncomingMessage, ServerResponse } from 'node:http'
import { Resend } from 'resend'

const TO_EMAIL = 'davegunwoo@gmail.com'
const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>'

interface ContactRequest extends IncomingMessage {
  body?: { name?: unknown; email?: unknown; message?: unknown }
}

export default async function handler(req: ContactRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.statusCode = 405
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const { name, email, message } = req.body ?? {}

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof email !== 'string' ||
    !email.trim() ||
    typeof message !== 'string' ||
    !message.trim()
  ) {
    res.statusCode = 400
    res.end(JSON.stringify({ error: 'Missing required fields' }))
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `${message}\n\nFrom: ${name} (${email})`,
    })

    if (error) {
      console.error('Resend rejected the email', error)
      res.statusCode = 502
      res.end(JSON.stringify({ error: 'Failed to send message' }))
      return
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true }))
  } catch (error) {
    console.error('Failed to send contact email', error)
    res.statusCode = 502
    res.end(JSON.stringify({ error: 'Failed to send message' }))
  }
}
