"use client"

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/carousel"

export default function CarouselDemo() {
  return (
    <Carousel label="Numbered cards">
      <div className="flex items-center gap-3">
        <CarouselPrevious />
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((n) => (
            <CarouselItem key={n} label={`Card ${n}`}>
              <span className="text-4xl font-semibold tabular-nums">{n}</span>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </div>
      <CarouselDots />
    </Carousel>
  )
}
