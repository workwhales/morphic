'use client'

import { UserButton, SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserIcon } from 'lucide-react'

export function UserMenu() {
  const { isSignedIn, user } = useUser()

  if (!isSignedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <SignInButton>
              <Button variant="ghost" className="w-full justify-start">
                Sign in
              </Button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <SignUpButton>
              <Button variant="ghost" className="w-full justify-start">
                Sign up
              </Button>
            </SignUpButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <UserButton
      appearance={{
        elements: {
          userButtonAvatarBox: 'h-8 w-8'
        }
      }}
    />
  )
}