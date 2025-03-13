'use client'

import { CHAT_ID } from '@/lib/constants'
import { Model } from '@/lib/types/models'
import { Message, useChat } from 'ai/react'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ChatMessages } from './chat-messages'
import { ChatPanel } from './chat-panel'
import { IconLogo } from './ui/icons'

export function Chat({
  id,
  savedMessages = [],
  query,
  models
}: {
  id: string
  savedMessages?: Message[]
  query?: string
  models?: Model[]
}) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    stop,
    append,
    data,
    setData
  } = useChat({
    initialMessages: savedMessages,
    id: CHAT_ID,
    body: { id },
    onFinish: () => {
      window.history.replaceState({}, '', `/search/${id}`)
    },
    onError: error => {
      toast.error(`Error in chat: ${error.message}`)
    },
    sendExtraMessageFields: false
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const toggleChat = () => {
    setIsExpanded(prev => !prev)
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }

  useEffect(() => {
    setMessages(savedMessages)
  }, [id])

  // Keyboard shortcut handling (Cmd+K / Ctrl+K to toggle, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggleChat()
      }
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  const onQuerySelect = (query: string) => {
    append({
      role: 'user',
      content: query
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setData(undefined)
    handleSubmit(e)
  }

  return (
    <>
      <div
        className={`fixed bottom-5 right-5 transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'w-[600px] h-[500px] rounded-lg border border-gray-200 shadow-lg bg-white p-4'
            : 'w-10 h-10 rounded-full bg-primary cursor-pointer hover:scale-110 flex items-center justify-center'
        }`}
        onClick={!isExpanded ? toggleChat : undefined}
      >
        {isExpanded ? (
          <div className="flex flex-col h-full">
            <button
              className="self-end text-sm text-gray-500"
              onClick={toggleChat}
            >
              Close
            </button>
            <div className="flex-1 overflow-auto mt-2">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <IconLogo className="h-16 w-16 text-primary mb-4" />
                  <h1 className="text-2xl font-bold">Morphic</h1>
                  <p className="text-sm text-gray-500 text-center">
                    A fully open-source AI-powered answer engine.
                  </p>
                </div>
              ) : (
                <ChatMessages
                  messages={messages}
                  data={data}
                  onQuerySelect={onQuerySelect}
                  isLoading={isLoading}
                  chatId={id}
                />
              )}
            </div>
            <ChatPanel
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              messages={messages}
              setMessages={setMessages}
              stop={stop}
              query={query}
              append={append}
              models={models}
              inputRef={inputRef}
            />
          </div>
        ) : (
          <Search className="h-5 w-5 text-white" />
        )}
      </div>
      <div className="fixed bottom-4 right-5 text-xs text-gray-400">
        Press <kbd className="px-1 py-0.5 bg-gray-100 rounded-md">⌘K</kbd> to
        toggle chat
      </div>
    </>
  )
}
