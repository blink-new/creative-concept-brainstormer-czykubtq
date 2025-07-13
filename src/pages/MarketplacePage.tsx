import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Star, Search, Filter, Coins, Eye, CheckCircle, Image, Send, Loader2, X } from 'lucide-react'
import { mockAgents, type Agent } from '../data/mockData'
import { motion } from 'framer-motion'
import { blink } from '../lib/blink'
import { toast } from 'sonner'

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [chatInput, setChatInput] = useState('')
  const [chatResponse, setChatResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getAgentsByCategory = (category: string) => {
    if (category === 'all') return mockAgents
    if (category === 'popular') return mockAgents.filter(agent => agent.category === 'popular')
    return mockAgents.filter(agent => agent.category === category)
  }

  const formatPrice = (price: number, currency: string) => {
    return `${price} ${currency}`
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const analyzeWithChatGPT = async () => {
    if (!chatInput.trim()) return

    setIsLoading(true)
    try {
      const prompt = chatInput
      const imageUrls: string[] = []
      
      // If images are uploaded, upload them to storage first
      if (uploadedImages.length > 0) {
        toast.info('Uploading images...')
        
        for (const image of uploadedImages) {
          try {
            const { publicUrl } = await blink.storage.upload(
              image,
              `chat-uploads/${Date.now()}-${image.name}`,
              { upsert: true }
            )
            imageUrls.push(publicUrl)
          } catch (error) {
            console.error('Failed to upload image:', error)
            toast.error(`Failed to upload ${image.name}`)
          }
        }
      }

      // Create the messages array for OpenAI
      const messages = [
        {
          role: "system" as const,
          content: "You are an expert HR assistant that analyzes resumes and job descriptions. Provide detailed analysis including skill matching, experience relevance, and hiring recommendations. If images are provided, analyze any text content visible in the images such as resumes, job postings, or documents."
        }
      ]

      if (imageUrls.length > 0) {
        // Add user message with images
        messages.push({
          role: "user" as const,
          content: [
            { type: "text" as const, text: prompt },
            ...imageUrls.map(url => ({ type: "image" as const, image: url }))
          ]
        })
      } else {
        // Add text-only user message
        messages.push({
          role: "user" as const,
          content: prompt
        })
      }

      // Use Blink SDK with the same structure as requested
      const { text } = await blink.ai.generateText({
        messages,
        model: "gpt-4o-mini",
        maxTokens: 1500
      })
      
      setChatResponse(text)
      toast.success('Analysis completed!')
    } catch (error) {
      console.error('Error processing request:', error)
      setChatResponse('Sorry, there was an error processing your request. Please try again later. Make sure you have configured your AI settings properly.')
      toast.error('Failed to process request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
        <div className="relative">
          <img 
            src={agent.image} 
            alt={agent.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {agent.isVerified && (
            <Badge className="absolute top-3 right-3 bg-green-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
              {agent.name}
            </CardTitle>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{agent.rating}</span>
            </div>
          </div>
          <CardDescription className="line-clamp-2">
            {agent.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-4">
            {agent.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{agent.totalUses.toLocaleString()} uses</span>
            </div>
            <div className="text-sm text-muted-foreground">
              by {agent.author}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Coins className="h-4 w-4 text-orange-500" />
              <span className="font-semibold">{formatPrice(agent.price, agent.currency)}</span>
            </div>
            <Link to={`/agent/${agent.id}`}>
              <Button size="sm">
                View Agent
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">AI Agent Marketplace</h1>
        <p className="text-muted-foreground text-lg">
          Discover and deploy powerful AI agents for any task
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="mb-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents, tags, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </Button>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs defaultValue="agents" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="chat">ChatGPT Analysis</TabsTrigger>
        </TabsList>

        {/* AI Agents Tab */}
        <TabsContent value="agents" className="mt-8">
          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({mockAgents.length})</TabsTrigger>
              <TabsTrigger value="micro">Micro ({getAgentsByCategory('micro').length})</TabsTrigger>
              <TabsTrigger value="macro">Macro ({getAgentsByCategory('macro').length})</TabsTrigger>
              <TabsTrigger value="popular">Popular ({getAgentsByCategory('popular').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-8">
              {filteredAgents.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-muted-foreground text-lg mb-4">
                    No agents found matching your criteria
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAgents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <AgentCard agent={agent} />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Featured Section */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Featured Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAgents.filter(agent => agent.isVerified).slice(0, 3).map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* ChatGPT Analysis Tab */}
        <TabsContent value="chat" className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <span>Resume & Job Analysis</span>
                </CardTitle>
                <CardDescription>
                  AI-powered resume and job description analysis. Upload documents, paste text, or describe requirements for intelligent matching and detailed insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="Try: 'Analyze this resume for a Software Engineer position' or 'Compare this candidate's skills with React, Node.js, and AWS requirements'"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="min-h-[120px] pr-20 resize-none"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 w-8 p-0"
                      >
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={analyzeWithChatGPT}
                        disabled={!chatInput.trim() || isLoading}
                        className="h-8 w-8 p-0"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Uploaded Images:</h4>
                      <div className="flex flex-wrap gap-2">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border-2 border-border"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Response Section */}
                {chatResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <h4 className="text-sm font-medium flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">AI</span>
                      </div>
                      <span>Analysis Result:</span>
                    </h4>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {chatResponse.split('\n').map((line, index) => (
                            <p key={index} className="mb-2 last:mb-0">
                              {line}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center space-x-2 py-8"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm text-muted-foreground">Analyzing with ChatGPT...</span>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}