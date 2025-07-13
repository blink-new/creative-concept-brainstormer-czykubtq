import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Upload, FileText, Coins } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function UploadPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
    file: null as File | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.type || !formData.price || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    // Mock upload process
    toast.loading('Uploading agent...')
    
    setTimeout(() => {
      toast.dismiss()
      toast.success('Agent uploaded successfully! Your NFT is being minted.')
      
      // Reset form
      setFormData({
        name: '',
        type: '',
        price: '',
        description: '',
        file: null
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Upload Your AI Agent</CardTitle>
            <CardDescription>
              Share your AI agent with the world and start earning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter agent name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Agent Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">Micro Agent</SelectItem>
                    <SelectItem value="macro">Macro Agent</SelectItem>
                    <SelectItem value="popular">Popular Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Use (ETH) *</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    placeholder="0.01"
                    className="pl-10"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your agent does..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Agent File (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload your agent code or model file
                  </p>
                  <Input
                    id="file"
                    type="file"
                    className="max-w-xs mx-auto"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Upload className="h-4 w-4 mr-2" />
                Mint Agent NFT
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}