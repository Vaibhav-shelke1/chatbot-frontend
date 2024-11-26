import ChatInterface from '@/components/ChatInterface'


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-24 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
      <div className='w-full'></div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4 text-white">AI Chatbot</h1>
        <ChatInterface />
      </div>
    </main>
  )
}

