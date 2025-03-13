'use client'

import { Search } from 'lucide-react'
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { IconLogo } from './ui/icons'
import { ModelSelector } from './model-selector'
import { SearchModeToggle } from './search-mode-toggle'
import { Model } from '@/lib/types/models'
import { getClientModels } from '@/lib/config/client-models'

type SearchBarContextType = {
  isExpanded: boolean
  toggleSearch: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const SearchBarContext = createContext<SearchBarContextType>({
  isExpanded: false,
  toggleSearch: () => {},
  searchQuery: '',
  setSearchQuery: () => {}
})

export const useSearchBar = () => useContext(SearchBarContext)

export function SearchBarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [models, setModels] = useState<Model[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Fetch models client-side
  useEffect(() => {
    const fetchModels = async () => {
      const fetchedModels = await getClientModels()
      setModels(fetchedModels)
    }
    
    fetchModels().catch(console.error)
  }, [])
  
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Set the query in context and close the search bar
      setSearchQuery(searchQuery)
      setIsExpanded(false)
    }
  }

  return (
    <SearchBarContext.Provider value={{ isExpanded, toggleSearch, searchQuery, setSearchQuery }}>
      <div className="relative w-full">
        {/* Animated search bar */}
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`transition-all duration-300 ease-in-out ${
              isExpanded
                ? 'w-[600px] h-14 rounded-full border border-input shadow-md bg-background flex items-center px-4'
                : 'w-10 h-10 rounded-full bg-muted cursor-pointer hover:scale-110 flex items-center justify-center'
            }`}
            onClick={!isExpanded ? toggleSearch : undefined}
          >
            {isExpanded ? (
              <form onSubmit={handleSearch} className="flex items-center w-full">
                <Search className="h-5 w-5 text-muted-foreground mr-2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for anything..."
                  className="flex-1 h-full border-none outline-none text-base bg-transparent"
                  onBlur={(e) => {
                    // Prevent closing when clicking inside the input
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      // Only close if clicking outside
                      if (e.relatedTarget === null) {
                        setIsExpanded(false)
                      }
                    }
                  }}
                />
                <div className="flex items-center gap-2 ml-2">
                  <SearchModeToggle />
                  <ModelSelector models={models} />
                </div>
              </form>
            ) : (
              <IconLogo className="h-6 w-6 text-primary" />
            )}
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full backdrop-blur-sm">
          Press <kbd className="px-2 py-0.5 bg-background rounded-md border border-input mx-1">⌘K</kbd> to
          search
        </div>

        {children}
      </div>
    </SearchBarContext.Provider>
  )
}