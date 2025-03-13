import { SearchChatWrapper } from '@/components/search-chat-wrapper'

// Force dynamic rendering to allow headers() and no-store fetch
export const dynamic = 'force-dynamic'

export default async function Page() {
  return <SearchChatWrapper />
}
