import { auth } from '@clerk/nextjs/server'
import React from 'react'
import { History } from './history'
import { HistoryList } from './history-list'

const HistoryContainer: React.FC = async () => {
  const enableSaveChatHistory = process.env.ENABLE_SAVE_CHAT_HISTORY === 'true'
  if (!enableSaveChatHistory) {
    return null
  }
  // Get user ID from Clerk authentication
  const { userId } = await auth()

  // Only show history for authenticated users
  if (!userId) {
    return null
  }

  return (
    <div>
      <History>
        <HistoryList userId={userId} />
      </History>
    </div>
  )
}

export default HistoryContainer
