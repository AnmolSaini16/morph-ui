"use client"

import { Carousel, type Slide } from "@/registry/carousel"

const slides: Slide[] = [1, 2, 3, 4, 5].map((n) => ({
  id: String(n),
  label: `Card ${n}`,
  content: <span className="text-4xl font-semibold tabular-nums">{n}</span>,
}))

export default function CarouselDemo() {
  return <Carousel slides={slides} label="Numbered cards" />
}
