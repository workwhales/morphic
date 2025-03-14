import { Chat } from '@/components/chat'
import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'

export default async function Page() {
  const id = generateId()
  const models = await getModels()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <Chat id={id} models={models} />
    </main>
  )
}
