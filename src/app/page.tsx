'use client'

import { useState, useEffect } from 'react'
import { Upload, Key, MessageSquare, Wand2, Download, Save, Trash2 } from 'lucide-react'

interface CachedData {
  apiKey: string
  prompt: string
  lora: string
}

export default function Home() {
  const [apiKey, setApiKey] = useState('')
  const [prompt, setPrompt] = useState('')
  const [lora, setLora] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [results, setResults] = useState<{ filename: string; url: string; seed: number }[]>([])

  useEffect(() => {
    // Load cached data from localStorage
    const cached = localStorage.getItem('fal-editor-cache')
    if (cached) {
      const data: CachedData = JSON.parse(cached)
      setApiKey(data.apiKey || '')
      setPrompt(data.prompt || '')
      setLora(data.lora || '')
    }
  }, [])

  const saveCache = () => {
    const data: CachedData = { apiKey, prompt, lora }
    localStorage.setItem('fal-editor-cache', JSON.stringify(data))
  }

  const clearCache = () => {
    localStorage.removeItem('fal-editor-cache')
    setApiKey('')
    setPrompt('')
    setLora('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || [])
    setFiles(uploadedFiles)
  }

  const uploadToFal = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('https://api.fal.ai/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    const data = await response.json()
    return data.url
  }

  const processImage = async (file: File, imageUrl: string) => {
    const response = await fetch('https://api.fal.ai/subscriptions/fal-ai/flux-2/klein/9b/base/edit/lora', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        guidance_scale: 5,
        num_inference_steps: 28,
        image_size: { width: 1024, height: 1024 },
        num_images: 1,
        acceleration: 'regular',
        enable_safety_checker: false,
        output_format: 'png',
        image_urls: [imageUrl],
        ...(lora && {
          loras: [{
            path: lora,
            scale: 1
          }]
        })
      })
    })
    
    if (!response.ok) {
      throw new Error('Processing failed')
    }
    
    const data = await response.json()
    return data
  }

  const processAllImages = async () => {
    if (!apiKey || files.length === 0) return
    
    setProcessing(true)
    setResults([])
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress(`Uploading ${file.name} (${i + 1}/${files.length})`)
        
        const imageUrl = await uploadToFal(file)
        
        setProgress(`Processing ${file.name} (${i + 1}/${files.length})`)
        
        const result = await processImage(file, imageUrl)
        
        if (result.images && result.images.length > 0) {
          setResults(prev => [...prev, {
            filename: file.name.replace(/\.[^/.]+$/, '_generated.png'),
            url: result.images[0].url,
            seed: result.seed || 0
          }])
        }
        
        // Add delay to avoid rate limiting
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
      
      setProgress('Processing complete!')
    } catch (error) {
      setProgress(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setProcessing(false)
    }
  }

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const downloadAll = () => {
    results.forEach(result => {
      downloadImage(result.url, result.filename)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">FAL Image Editor</h1>
        
        <div className="space-y-6">
          {/* API Key Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5" />
              <h2 className="text-xl font-semibold">API Key</h2>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your FAL API key"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={saveCache}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          {/* Prompt Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Prompt</h2>
            </div>
            <div className="flex gap-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
              <button
                onClick={saveCache}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 h-fit"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          {/* LoRA Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5" />
              <h2 className="text-xl font-semibold">LoRA</h2>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={lora}
                onChange={(e) => setLora(e.target.value)}
                placeholder="Enter LoRA URL"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={saveCache}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Upload Images</h2>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {files.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={processAllImages}
              disabled={!apiKey || files.length === 0 || processing}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              {processing ? 'Processing...' : 'Process Images'}
            </button>
            
            <button
              onClick={clearCache}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cache
            </button>
            
            {results.length > 0 && (
              <button
                onClick={downloadAll}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            )}
          </div>

          {/* Progress */}
          {progress && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-700">{progress}</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img
                      src={result.url}
                      alt={result.filename}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm font-medium truncate">{result.filename}</p>
                      <p className="text-xs text-gray-500">Seed: {result.seed}</p>
                      <button
                        onClick={() => downloadImage(result.url, result.filename)}
                        className="mt-2 w-full px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
