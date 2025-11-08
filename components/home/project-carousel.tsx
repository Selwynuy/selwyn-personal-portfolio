"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'

type Media = {
  image?: string
  video?: string
}

interface ProjectCarouselProps {
  title: string
  media: Media[]
}

export function ProjectCarousel({ title, media }: ProjectCarouselProps) {
  const items = media && media.length > 0 ? media : []
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!api) return
    setSelected(api.selectedScrollSnap() ?? 0)
    const onSelect = () => setSelected(api.selectedScrollSnap() ?? 0)
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  return (
    <div className="group relative">
      <div className="relative rounded-[28px] p-[2px] bg-gradient-to-br from-purple-500/40 via-transparent to-sky-500/40">
        <div className="relative overflow-hidden rounded-[24px] bg-black/30 ring-1 ring-white/10 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.65)] transition-transform duration-700 ease-out skew-y-2 -rotate-[2deg] group-hover:skew-y-0 group-hover:rotate-0">
            <div className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-purple-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-1/3 h-64 w-64 rounded-full bg-sky-500/25 blur-3xl" />

            <Carousel className="relative" setApi={setApi}>
              <CarouselContent>
                {(items.length > 0 ? items : [{ image: "/window.svg" }]).map((item, i) => (
                  <CarouselItem key={i}>
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      {item.image && (
                        <Image src={item.image} alt={title} fill className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]" />
                      )}
                      {item.video && (
                        <video
                          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          src={item.video}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseEnter={(e)=>{ try { (e.currentTarget as HTMLVideoElement).play() } catch{} }}
                          onMouseLeave={(e)=>{ try { (e.currentTarget as HTMLVideoElement).pause() } catch{} }}
                        />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_50%_-40%,transparent,rgba(0,0,0,0.5)),linear-gradient(to_top,rgba(0,0,0,0.6),transparent_30%)]" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {items.length > 1 && (
                <>
                  <CarouselPrevious className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CarouselNext className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </Carousel>
          </div>
        </div>

      {items.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-[6px] w-10 rounded-full border border-white/40 transition ${i === selected ? 'bg-white/70' : 'bg-transparent hover:bg-white/20'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}



