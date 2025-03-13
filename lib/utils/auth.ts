'use server'

import { auth, currentUser } from '@clerk/nextjs/server'

export async function getUserId(): Promise<string> {
  // Get auth session
  const session = await auth()

  // Return user ID if available from auth session
  if (session.userId) {
    return session.userId
  }

  // Fallback: try to get from currentUser
  const user = await currentUser()
  if (user?.id) {
    return user.id
  }

  // Safety fallback for public routes or unauthorized access
  throw new Error('User not authenticated')
}

export async function getCurrentUser() {
  return await currentUser()
}
