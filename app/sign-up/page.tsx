import { SignUp } from '@clerk/nextjs'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account'
}

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8 text-center">Create an account</h1>
        <SignUp appearance={{
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