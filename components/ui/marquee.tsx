"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number // pixels per second
  pauseOnHover?: boolean
}

export function Marquee({ className, children, speed = 80, pauseOnHover = true, ...props }: MarqueeProps) {
  const animationDuration = `${Math.max(10, Math.min(120, 2000 / speed))}s`

  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-12 will-change-transform animate-[marquee_linear_infinite]",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{ animationDuration }}
      >
        {children}
        {children}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}


