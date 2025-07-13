export interface Agent {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  currency: string
  rating: number
  totalUses: number
  author: string
  category: 'micro' | 'macro' | 'popular'
  image: string
  tags: string[]
  isVerified: boolean
  createdAt: string
}

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'ResumeAI',
    description: 'AI-powered resume analyzer and optimizer for job seekers',
    longDescription: 'ResumeAI uses advanced natural language processing to analyze resumes, identify areas for improvement, and suggest optimizations based on industry best practices. It can help you tailor your resume for specific job postings and increase your chances of getting hired.',
    price: 0.05,
    currency: 'ETH',
    rating: 4.8,
    totalUses: 15420,
    author: 'CareerTech Labs',
    category: 'popular',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&auto=format',
    tags: ['career', 'AI', 'optimization'],
    isVerified: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'CodeReviewer',
    description: 'Automated code review and security analysis agent',
    longDescription: 'CodeReviewer performs comprehensive code analysis, identifying potential bugs, security vulnerabilities, and optimization opportunities. It supports multiple programming languages and integrates with popular development workflows.',
    price: 0.1,
    currency: 'ETH',
    rating: 4.9,
    totalUses: 8930,
    author: 'DevSecure',
    category: 'macro',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&auto=format',
    tags: ['development', 'security', 'automation'],
    isVerified: true,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'MarketAnalyst',
    description: 'Real-time crypto market analysis and trading signals',
    longDescription: 'MarketAnalyst provides real-time cryptocurrency market analysis, technical indicators, and trading signals. It uses machine learning to identify patterns and predict market movements with high accuracy.',
    price: 0.25,
    currency: 'ETH',
    rating: 4.6,
    totalUses: 5670,
    author: 'CryptoIntel',
    category: 'macro',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop&auto=format',
    tags: ['trading', 'analysis', 'crypto'],
    isVerified: true,
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    name: 'ContentCreator',
    description: 'AI content generator for social media and blogs',
    longDescription: 'ContentCreator helps you generate engaging content for various platforms including Twitter, LinkedIn, Instagram, and blogs. It understands your brand voice and creates content that resonates with your audience.',
    price: 0.03,
    currency: 'ETH',
    rating: 4.7,
    totalUses: 12340,
    author: 'MediaMind',
    category: 'popular',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop&auto=format',
    tags: ['content', 'social media', 'marketing'],
    isVerified: false,
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    name: 'DataCleaner',
    description: 'Automated data cleaning and preprocessing',
    longDescription: 'DataCleaner automates the tedious process of data cleaning and preprocessing. It can handle missing values, outliers, data type conversions, and format standardization across various data formats.',
    price: 0.02,
    currency: 'ETH',
    rating: 4.5,
    totalUses: 3210,
    author: 'DataFlow',
    category: 'micro',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format',
    tags: ['data', 'preprocessing', 'automation'],
    isVerified: true,
    createdAt: '2024-01-05'
  },
  {
    id: '6',
    name: 'TranslateBot',
    description: 'Multi-language translation with context awareness',
    longDescription: 'TranslateBot provides accurate translations across 100+ languages with deep understanding of context, idioms, and cultural nuances. Perfect for international business communications.',
    price: 0.01,
    currency: 'ETH',
    rating: 4.8,
    totalUses: 18750,
    author: 'LinguaTech',
    category: 'popular',
    image: 'https://images.unsplash.com/photo-1526661934255-5233e8f3c3a9?w=400&h=300&fit=crop&auto=format',
    tags: ['translation', 'language', 'communication'],
    isVerified: true,
    createdAt: '2024-01-20'
  },
  {
    id: '7',
    name: 'LegalAssistant',
    description: 'Legal document analysis and contract review',
    longDescription: 'LegalAssistant helps analyze legal documents, identify potential issues, and provide recommendations for contract terms. It supports various document types and jurisdictions.',
    price: 0.5,
    currency: 'ETH',
    rating: 4.9,
    totalUses: 1890,
    author: 'LegalTech Pro',
    category: 'macro',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop&auto=format',
    tags: ['legal', 'contracts', 'analysis'],
    isVerified: true,
    createdAt: '2024-01-03'
  },
  {
    id: '8',
    name: 'ImageOptimizer',
    description: 'Batch image processing and optimization',
    longDescription: 'ImageOptimizer provides automated image processing including resizing, compression, format conversion, and quality enhancement. Perfect for web developers and content creators.',
    price: 0.005,
    currency: 'ETH',
    rating: 4.4,
    totalUses: 7650,
    author: 'PixelCraft',
    category: 'micro',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&auto=format',
    tags: ['image', 'optimization', 'processing'],
    isVerified: false,
    createdAt: '2024-01-18'
  }
]

export const mockDashboardData = {
  stats: {
    totalUses: 1250,
    totalEarnings: 15.75,
    averageRating: 4.7,
    activeAgents: 3
  },
  myAgents: [
    {
      id: 'my-1',
      name: 'EmailSummarizer',
      status: 'active',
      totalUses: 890,
      earnings: 8.9,
      rating: 4.8
    },
    {
      id: 'my-2',
      name: 'TaskPlanner',
      status: 'active', 
      totalUses: 340,
      earnings: 6.8,
      rating: 4.6
    },
    {
      id: 'my-3',
      name: 'MoodAnalyzer',
      status: 'pending',
      totalUses: 20,
      earnings: 0.05,
      rating: 4.9
    }
  ],
  recentUses: [
    { agentName: 'ResumeAI', user: 'alice.eth', timestamp: '2024-01-22 14:30', earnings: 0.05 },
    { agentName: 'ContentCreator', user: 'bob.eth', timestamp: '2024-01-22 13:15', earnings: 0.03 },
    { agentName: 'TranslateBot', user: 'charlie.eth', timestamp: '2024-01-22 12:45', earnings: 0.01 },
    { agentName: 'DataCleaner', user: 'diana.eth', timestamp: '2024-01-22 11:20', earnings: 0.02 }
  ]
}