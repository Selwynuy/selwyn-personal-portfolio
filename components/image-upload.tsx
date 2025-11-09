'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { uploadImage } from '@/lib/upload'

interface ImageUploadProps {
  onUpload: (url: string) => void
  bucket?: 'avatars' | 'projects' | 'resumes' | 'blog' | 'gallery' | 'gallery-thumbnails'
  accept?: string
  maxSizeMB?: number
  buttonText?: string
}

export function ImageUpload({
  onUpload,
  bucket = 'projects',
  accept = 'image/*',
  maxSizeMB = 5,
  buttonText
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isPDF = accept === 'application/pdf'
  const defaultButtonText = isPDF ? 'Upload PDF' : 'Upload Image'

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset state
    setError(null)
    setLoading(true)

    try {
      // Validate file type
      if (isPDF && file.type !== 'application/pdf') {
        throw new Error('Please upload a PDF file')
      } else if (!isPDF && !file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }

      // Validate file size
      const maxSize = maxSizeMB * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error(`File size should be less than ${maxSizeMB}MB`)
      }

      const url = await uploadImage(file, bucket)
      onUpload(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? 'Uploading...' : (buttonText || defaultButtonText)}
      </Button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
