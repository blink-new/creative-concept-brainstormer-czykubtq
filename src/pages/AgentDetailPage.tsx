import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Star, ArrowLeft, Coins, Eye, CheckCircle, Play, Copy, ExternalLink, Image, X, Loader2 } from 'lucide-react'
import { mockAgents } from '../data/mockData'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { blink } from '../lib/blink'

export default function AgentDetailPage() {
  const { id } = useParams()
  const [isRunning, setIsRunning] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const agent = mockAgents.find(a => a.id === id)
  
  if (!agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Agent not found</h1>
          <Link to="/marketplace">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleRunAgent = async () => {
    if (!inputValue.trim()) {
      toast.error('Please provide input for the agent')
      return
    }

    setIsRunning(true)
    
    try {
      const prompt = inputValue
      const imageUrls: string[] = []
      
      // If images are uploaded, upload them to storage first
      if (uploadedImages.length > 0) {
        toast.info('Uploading images...')
        
        for (const image of uploadedImages) {
          try {
            const { publicUrl } = await blink.storage.upload(
              image,
              `agent-uploads/${Date.now()}-${image.name}`,
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
          content: `You are ${agent.name}, ${agent.description}. Your goal is to ${agent.longDescription.split('.')[0].toLowerCase()}.`
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

      // Use Blink SDK with the exact same structure as requested
      const { text } = await blink.ai.generateText({
        messages,
        model: "gpt-4o-mini",
        maxTokens: 1500
      })
      
      setResult(text)
      toast.success('Agent executed successfully!')
    } catch (error) {
      console.error('Error running agent:', error)
      toast.error('Failed to run agent. Please try again.')
      setResult('Sorry, there was an error processing your request. Please try again later.')
    } finally {
      setIsRunning(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return `${price} ${currency}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/marketplace">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  {agent.isVerified && (
                    <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{agent.name}</h1>
                      <p className="text-muted-foreground">by {agent.author}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{agent.rating}</span>
                      <span className="text-muted-foreground text-sm">({agent.totalUses.toLocaleString()} uses)</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-lg text-muted-foreground">
                    {agent.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {agent.longDescription}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{agent.totalUses.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Uses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{agent.rating}</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{agent.author}</div>
                    <div className="text-sm text-muted-foreground">Author</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{agent.createdAt}</div>
                    <div className="text-sm text-muted-foreground">Created</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Run Agent</span>
                  <div className="flex items-center space-x-1">
                    <Coins className="h-5 w-5 text-orange-500" />
                    <span className="font-bold text-lg">{formatPrice(agent.price, agent.currency)}</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Execute this agent with your custom input
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Category</div>
                    <div className="font-medium capitalize">{agent.category}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Uses</div>
                    <div className="font-medium">{agent.totalUses.toLocaleString()}</div>
                  </div>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Run Agent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Run {agent.name}</DialogTitle>
                      <DialogDescription>
                        Provide input for the agent and view the results
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Input</label>
                        <Textarea
                          placeholder={`Enter your input for ${agent.name}...`}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      {/* Image Upload Section */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium mb-2 block">Upload Images (Optional)</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          ref={fileInputRef}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {uploadedImages.length > 0 && (
                          <div className="space-y-2">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
                                <img 
                                  src={URL.createObjectURL(image)} 
                                  alt={image.name} 
                                  className="w-8 h-8 object-cover rounded-full" 
                                />
                                <span className="text-sm flex-1 truncate">{image.name}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {result && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Result</label>
                          <div className="p-4 bg-muted rounded-lg">
                            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              navigator.clipboard.writeText(result)
                              toast.success('Result copied to clipboard!')
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Result
                          </Button>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleRunAgent}
                        disabled={isRunning || !inputValue.trim()}
                        className="w-full"
                      >
                        {isRunning ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Running...
                          </>
                        ) : (
                          `Run Agent (${formatPrice(agent.price, agent.currency)})`
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="text-xs text-muted-foreground text-center">
                  💡 You'll be charged {formatPrice(agent.price, agent.currency)} per execution
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Agent Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{agent.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="outline" className="capitalize">{agent.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verification</span>
                  <span className="flex items-center space-x-1">
                    {agent.isVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Verified</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Unverified</span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}