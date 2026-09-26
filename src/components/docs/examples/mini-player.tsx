"use client"

import { useEffect, useState } from "react"
import { MiniPlayer, type Track } from "@/registry/mini-player"

const photo =
  "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?w=600&q=80&auto=format&fit=crop"

const tracks: Track[] = [
  {
    id: "slow-light",
    title: "Slow Light",
    artist: "Maya Jones",
    cover: `url(${photo}) 50% 50% / cover`,
    coverFilter: "grayscale(1) contrast(1.1)",
    duration: 204,
  },
  {
    id: "paper-tides",
    title: "Paper Tides",
    artist: "Leo Park",
    cover: `url(${photo}) 20% 30% / 180%`,
    coverFilter: "grayscale(1) blur(6px) brightness(1.1)",
    duration: 187,
  },
  {
    id: "after-hours",
    title: "After Hours",
    artist: "Ana Silva",
    cover: `url(${photo}) 80% 60% / 240%`,
    coverFilter: "grayscale(1) contrast(1.5) brightness(0.8)",
    duration: 231,
  },
  {
    id: "quiet-signal",
    title: "Quiet Signal",
    artist: "Sam Lee",
    cover: `url(${photo}) 40% 80% / 150%`,
    coverFilter: "grayscale(1) blur(2px) brightness(0.9)",
    duration: 176,
  },
  {
    id: "long-way-home",
    title: "The Long Way Home",
    artist: "The Night Office",
    cover: `url(${photo}) 70% 20% / 300%`,
    coverFilter: "grayscale(1) contrast(1.2) brightness(1.2)",
    duration: 262,
  },
]

const bars = [
  { x: 4, rest: 9, values: "9;4;11;6;9", dur: "0.9s" },
  { x: 8, rest: 5, values: "5;10;3;8;5", dur: "0.7s" },
  { x: 12, rest: 8, values: "8;5;10;3;8", dur: "1.1s" },
]
const Equalizer = ({ playing, className }: { playing: boolean; className?: string }) => (
  <svg
    className={className}
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    aria-hidden
  >
    {bars.map((bar) => (
      <line key={bar.x} x1={bar.x} x2={bar.x} y1={bar.rest} y2={13}>
        {playing && (
          <animate attributeName="y1" values={bar.values} dur={bar.dur} repeatCount="indefinite" />
        )}
      </line>
    ))}
  </svg>
)

const time = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`

export default function MiniPlayerDemo() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(72)
  const track = tracks[index]

  const play = (next: number) => {
    setIndex((next + tracks.length) % tracks.length)
    setElapsed(0)
  }

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timer)
  }, [playing])

  if (elapsed >= track.duration) play(index + 1)

  return (
    <MiniPlayer
      track={track}
      playing={playing}
      elapsed={elapsed}
      onPlayingChange={setPlaying}
      onNext={() => play(index + 1)}
      onPrevious={() => (elapsed > 3 ? setElapsed(0) : play(index - 1))}
    >
      <p className="px-4 pt-4 pb-2 text-lg font-semibold tracking-tight">Library</p>
      <ul className="px-2">
        {tracks.map((t, i) => {
          const current = i === index
          return (
            <li key={t.id}>
              <button
                type="button"
                aria-current={current}
                onClick={() => {
                  if (!current) play(i)
                  setPlaying(true)
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-ring/50 ${current ? "bg-muted" : "hover:bg-muted/50"}`}
              >
                <span className="relative size-10 shrink-0 overflow-hidden rounded-sm">
                  <span
                    className="absolute inset-0 scale-110"
                    style={{ background: t.cover, filter: t.coverFilter }}
                  />
                  {current && (
                    <span className="absolute inset-0 grid place-items-center bg-background/60 text-foreground">
                      <Equalizer playing={playing} className="motion-reduce:hidden" />
                      <Equalizer playing={false} className="hidden motion-reduce:block" />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{t.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{t.artist}</span>
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {time(t.duration)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </MiniPlayer>
  )
}
