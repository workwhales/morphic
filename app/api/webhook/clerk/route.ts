import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error: Missing svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ''
  if (!webhookSecret) {
    return new NextResponse('Error: Missing webhook secret', { status: 500 })
  }

  const wh = new Webhook(webhookSecret)

  let evt: WebhookEvent

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new NextResponse('Error verifying webhook', { status: 400 })
  }

  // Handle the webhook event
  const eventType = evt.type

  // Handle user.created and user.updated events
  if (eventType === 'user.created' || eventType === 'user.updated') {
    // You can handle user creation/updates here
    // For example, you might want to store additional user data in your database
    console.log(
      `User ${eventType === 'user.created' ? 'created' : 'updated'}:`,
      evt.data
    )
  }

  // Handle user.deleted event
  if (eventType === 'user.deleted') {
    const userId = evt.data.id as string
    console.log(`User deleted: ${userId}`)
    // Here you could clean up user data from your database or Redis
  }

  return NextResponse.json({ success: true })
}
