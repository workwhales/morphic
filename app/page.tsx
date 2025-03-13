import { Chat } from '@/components/chat'
import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'

// Force dynamic rendering to allow headers() and no-store fetch
export const dynamic = 'force-dynamic'

export default async function Page() {
  const id = generateId()
  const models = await getModels()

  return <Chat id={id} models={models} />
}
