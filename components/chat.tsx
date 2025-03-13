'use client'

import { CHAT_ID } from '@/lib/constants'
import { Model } from '@/lib/types/models'
import { Message, useChat } from 'ai/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ChatMessages } from './chat-messages'
import { ChatPanel } from './chat-panel'
import { useSearchBar } from './search-bar-provider'
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
  const { searchQuery } = useSearchBar()
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
    body: {
      id
    },
    onFinish: () => {
      window.history.replaceState({}, '', `/search/${id}`)
    },
    onError: error => {
      toast.error(`Error in chat: ${error.message}`)
    },
    sendExtraMessageFields: false // Disable extra message fields
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const toggleChat = () => {
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    setMessages(savedMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Process search query if available
  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== '') {
      append({
        role: 'user',
        content: searchQuery
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const onQuerySelect = (query: string) => {
    append({
      role: 'user',
      content: query
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setData(undefined) // reset data to clear tool call
    handleSubmit(e)
  }

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-primary text-white p-3 rounded-full shadow-lg"
      >
        {isExpanded ? 'Close Chat' : 'Open Chat'}
      </button>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-10 right-10 bg-white shadow-lg rounded-lg p-4 ${
          isExpanded ? 'block' : 'hidden'
        }`}
      >
        <div className="flex flex-col w-full max-w-3xl pt-14 pb-60 mx-auto stretch">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center my-8">
              <IconLogo className="h-16 w-16 text-primary mb-4" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-2">
                Morphic
              </h1>
              <p className="text-muted-foreground text-center max-w-md">
                A fully open-source AI-powered answer engine with a generative
                UI
              </p>
            </div>
          )}

          <ChatMessages
            messages={messages}
            data={data}
            onQuerySelect={onQuerySelect}
            isLoading={isLoading}
            chatId={id}
          />
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
          />
        </div>
      </motion.div>
    </>
  )
}
