import { SignIn } from '@clerk/nextjs'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account'
}

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8 text-center">Sign in to your account</h1>
        <SignIn appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'bg-card shadow-md',
            headerTitle: 'text-foreground',
            headerSubtitle: 'text-muted-foreground',
            formFieldLabel: 'text-foreground',
            footerActionLink: 'text-primary hover:text-primary/90',
          }
        }} />
      </div>
    </div>
  )
}