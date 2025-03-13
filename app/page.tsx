import { Chat } from '@/components/chat'
import { SearchBarProvider } from '@/components/search-bar-provider'
import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'

// Force dynamic rendering to allow headers() and no-store fetch
export const dynamic = 'force-dynamic'

export default async function Page() {
  const id = generateId()
  const models = await getModels()

  return (
    <SearchBarProvider>
      <Chat id={id} models={models} />
    </SearchBarProvider>
  )
}
