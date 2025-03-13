'use client'

import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleSearch = () => {
    setIsExpanded(!isExpanded)

    // Focus the input when expanded
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300) // Wait for animation to complete
    }
  }

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleSearch()
      }

      // Close on escape
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'w-[600px] h-14 rounded-full border border-gray-200 shadow-sm bg-white flex items-center px-4'
            : 'w-4 h-4 rounded-full bg-black cursor-pointer hover:scale-110'
        }`}
        onClick={!isExpanded ? toggleSearch : undefined}
      >
        {isExpanded ? (
          <div className="flex items-center w-full">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for anything..."
              className="flex-1 h-full border-none outline-none text-base"
              onBlur={e => {
                // Prevent closing when clicking inside the input
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  // Only close if clicking outside
                  if (e.relatedTarget === null) {
                    setIsExpanded(false)
                  }
                }
              }}
            />
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-4 text-sm text-gray-400">
        Press <kbd className="px-2 py-1 bg-gray-100 rounded-md">⌘K</kbd> to
        search
      </div>
    </main>
  )
}
