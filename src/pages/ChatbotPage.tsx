import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Bot, Send, User, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { blink } from '../lib/blink'
import { mockAgents } from '../data/mockData'
import { toast } from 'sonner'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI assistant. I can help you find the perfect agent for your needs. What are you looking to accomplish?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      // Create a system prompt that includes information about available agents
      const agentsList = mockAgents.map(agent => 
        `- ${agent.name}: ${agent.description} (Tags: ${agent.tags.join(', ')}) - ${agent.price} ${agent.currency}`
      ).join('\n')

      const { text } = await blink.ai.generateText({
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that helps users find the perfect AI agent for their needs. You have access to the following agents in the marketplace:

${agentsList}

Your job is to:
1. Understand what the user needs
2. Recommend the most suitable agent(s) from the list above
3. Explain why you recommend them
4. Provide a direct link using this format: [View AgentName →](/agent/ID)
5. Be helpful, friendly, and concise

Always recommend actual agents from the list above, not made-up ones.`
          },
          {
            role: "user", 
            content: currentInput
          }
        ],
        model: "gpt-4o-mini",
        maxTokens: 500
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: text,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error getting AI recommendation:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try asking about specific types of agents like 'resume analysis', 'code review', or 'content creation'.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to get AI recommendation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <span>AI Agent Recommendation Assistant</span>
              <Badge variant="secondary">Powered by OpenAI</Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-blue-600' : 'bg-muted'}`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-muted'}`}>
                      <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                        {message.content.split('\n').map((line, index) => {
                          // Convert markdown links to actual links
                          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
                          const parts = line.split(linkRegex)
                          
                          return (
                            <p key={index} className="mb-1 last:mb-0">
                              {parts.map((part, partIndex) => {
                                if (partIndex % 3 === 1) {
                                  // This is link text
                                  return (
                                    <a 
                                      key={partIndex}
                                      href={parts[partIndex + 1]} 
                                      className={`underline font-medium ${message.type === 'user' ? 'text-blue-100 hover:text-white' : 'text-blue-600 hover:text-blue-800'}`}
                                    >
                                      {part}
                                    </a>
                                  )
                                } else if (partIndex % 3 === 2) {
                                  // This is the URL, skip it as it's already used
                                  return null
                                } else {
                                  // Regular text
                                  return part
                                }
                              })}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                    <div className="p-2 rounded-full bg-muted">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="p-3 rounded-lg bg-muted flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Try: 'I need help with resume analysis' or 'Show me code review tools'"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={!inputValue.trim() || isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}