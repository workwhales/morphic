'use client'

import { generateId } from 'ai'
import { Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Chat } from './chat'

export function SearchChatWrapper() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSearching, setIsSearching] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [chatId, setChatId] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleSearch = useCallback(() => {
    setIsExpanded(prev => !prev)

    // Focus the input when expanded
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300) // Wait for animation to complete
    }
  }, [isExpanded])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setChatId(generateId())
      setIsSearching(false)
    }
  }

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isExpanded || isSearching) {
          toggleSearch()
        }
      }

      // Close on escape
      if (e.key === 'Escape') {
        if (isExpanded && isSearching) {
          setIsExpanded(false)
        } else if (!isSearching) {
          setIsSearching(true)
          setIsExpanded(true)
          setSearchQuery('')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, isSearching, toggleSearch])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      {isSearching ? (
        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded
              ? 'w-[600px] h-14 rounded-full border border-gray-200 shadow-sm bg-white flex items-center px-4'
              : 'w-4 h-4 rounded-full bg-black cursor-pointer hover:scale-110'
          }`}
          onClick={!isExpanded ? toggleSearch : undefined}
        >
          {isExpanded ? (
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
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
            </form>
          ) : null}
        </div>
      ) : (
        <div
          className={`w-full transition-opacity duration-300 ${
            isSearching ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Chat id={chatId} query={searchQuery} />
        </div>
      )}

      {isSearching && (
        <div className="fixed bottom-4 text-sm text-gray-400">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded-md">⌘K</kbd> to
          search
        </div>
      )}
    </main>
  )
}
