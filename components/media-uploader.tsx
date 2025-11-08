'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { uploadImage } from '@/lib/upload'
import { X, GripVertical, Trash2, ImagePlus, Video } from 'lucide-react'

type MediaItem = { id?: string; type: 'image' | 'video'; url: string }

interface MediaUploaderProps {
  items: MediaItem[]
  onChange: (items: MediaItem[]) => void
  onSetCover?: (url: string) => void
}

export function MediaUploader({ items, onChange, onSetCover }: MediaUploaderProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleAddImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    try {
      const uploads: MediaItem[] = []
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        if (file.size > 5 * 1024 * 1024) continue
        const url = await uploadImage(file, 'projects')
        uploads.push({ type: 'image', url })
      }
      if (uploads.length) onChange([...items, ...uploads])
    } finally {
      setIsUploading(false)
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  const handleAddVideos = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    // For now, accept external URLs pasted separately; placeholder for future video support
    // Could implement upload to supabase storage with mime video/*
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return
    const next = items.slice()
    const [spliced] = next.splice(from, 1)
    next.splice(to, 0, spliced)
    onChange(next)
  }

  const removeAt = (index: number) => {
    const next = items.slice()
    next.splice(index, 1)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-slate-400 hover:bg-white/5 transition-colors"
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }}
        onDrop={async (e) => {
          e.preventDefault()
          const files = Array.from(e.dataTransfer.files)
          await handleAddImages({ length: files.length, item: (i:number)=>files[i] } as unknown as FileList)
        }}
      >
        Drop images here or use the buttons below
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((m, i) => (
          <div key={(m.id || m.url) + i} className="relative w-40 h-28 rounded-lg overflow-hidden ring-1 ring-white/10 bg-black/20">
            {m.type === 'image' ? (
              <Image src={m.url} alt="media" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-slate-300">
                <Video className="w-4 h-4 mr-1" /> Video
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-1 bg-black/40">
              <div className="flex gap-1">
                <Button type="button" size="icon" variant="outline" className="h-6 w-6" onClick={() => move(i, i - 1)}>
                  <GripVertical className="h-3 w-3 rotate-90" />
                </Button>
                <Button type="button" size="icon" variant="outline" className="h-6 w-6" onClick={() => move(i, i + 1)}>
                  <GripVertical className="h-3 w-3 -rotate-90" />
                </Button>
              </div>
              <div className="flex gap-1">
                {onSetCover && (
                  <Button type="button" size="sm" variant="secondary" className="h-6 px-2 text-xs" onClick={() => onSetCover(m.url)}>
                    Set cover
                  </Button>
                )}
                <Button type="button" size="icon" variant="destructive" className="h-6 w-6" onClick={() => removeAt(i)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleAddImages(e.target.files)} />
        <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={isUploading}>
          <ImagePlus className="w-4 h-4 mr-2" /> {isUploading ? 'Uploading…' : 'Add images'}
        </Button>
      </div>
    </div>
  )
}


