import { clerkMiddleware } from '@clerk/nextjs/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Run Clerk middleware and await response
  const middlewareResult = await clerkMiddleware()(request, event)

  // Ensure middlewareResult is valid
  if (!middlewareResult || !(middlewareResult instanceof NextResponse)) {
    return NextResponse.next()
  }

  // Get the protocol from X-Forwarded-Proto header or request protocol
  const protocol =
    request.headers.get('x-forwarded-proto') || request.nextUrl.protocol

  // Get the host from X-Forwarded-Host header or request host
  const host =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || ''

  // Construct the base URL - ensure protocol has :// format
  const baseUrl = `${protocol}${protocol.endsWith(':') ? '//' : '://'}${host}`

  // Add request information to response headers
  middlewareResult.headers.set('x-url', request.url)
  middlewareResult.headers.set('x-host', host)
  middlewareResult.headers.set('x-protocol', protocol)
  middlewareResult.headers.set('x-base-url', baseUrl)

  return middlewareResult
}

export default middleware

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}
