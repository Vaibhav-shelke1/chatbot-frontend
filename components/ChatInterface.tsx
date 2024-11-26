'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'bot'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from the server')
      }

      const data = await response.json()
      const botMessage: Message = { role: 'bot', content: data.response }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { role: 'bot', content: '<h2>Error</h2><p>Sorry, I encountered an error. Please try again.</p>' }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl overflow-hidden border-2 border-gray-700">
      <CardContent className="p-6">
        <ScrollArea className="h-[500px] pr-4 mb-4 overflow-y-auto" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`p-2 rounded-full ${
                  message.role === 'user' ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-100'
                  } transition-all duration-300 ease-in-out hover:shadow-lg rounded-md`}
                >
                  {message.role === 'user' ? (
                    message.content
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: message.content }} className="prose prose-invert max-w-none rounded-md" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out rounded-md"
            aria-label="Chat input"
          />
          <Button 
            type="submit" 
            className={`bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out rounded-md ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
            disabled={isLoading}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

