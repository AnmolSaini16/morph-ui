"use client"

import { PostList, type Post } from "@/components/post-list"

const photo =
  "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?w=600&q=80&auto=format&fit=crop"

const posts: Post[] = [
  {
    id: "native-motion",
    title: "Motion without a library",
    excerpt: "What the View Transition API can do for everyday React UI.",
    body: "Most interface motion is just an element moving from one place to another. The browser can now animate that for you, so the code stays about state instead of keyframes.",
    author: "Maya Jones",
    date: "Sep 12",
    readTime: "6 min read",
    cover: `url(${photo}) 50% 50% / cover`,
    coverFilter: "grayscale(1) contrast(1.1)",
  },
  {
    id: "quiet-interfaces",
    title: "Designing quiet interfaces",
    excerpt: "Why the best transitions are the ones you barely notice.",
    body: "Motion should explain where something came from and where it went. Anything more is decoration, and decoration gets tiring the tenth time you see it.",
    author: "Leo Park",
    date: "Sep 4",
    readTime: "4 min read",
    cover: `url(${photo}) 20% 30% / 180%`,
    coverFilter: "grayscale(1) blur(6px) brightness(1.1)",
  },
  {
    id: "timing-tokens",
    title: "Timing tokens that scale",
    excerpt: "One set of durations for exits, entries and moves across an app.",
    body: "Exits should be short, entries a touch longer, and moves longest of all. Put those three numbers in tokens and every component starts to feel related.",
    author: "Ana Silva",
    date: "Aug 28",
    readTime: "5 min read",
    cover: `url(${photo}) 80% 60% / 240%`,
    coverFilter: "grayscale(1) contrast(1.5) brightness(0.8)",
  },
  {
    id: "shipping-small",
    title: "Shipping small, often",
    excerpt: "How a tiny team keeps a fast release rhythm without burning out.",
    body: "Small releases are easier to review, easier to roll back and easier to talk about. The trick is making the path to production boring on purpose.",
    author: "Sam Lee",
    date: "Aug 19",
    readTime: "3 min read",
    cover: `url(${photo}) 40% 80% / 150%`,
    coverFilter: "grayscale(1) blur(2px) brightness(0.9)",
  },
]

export default function PostListDemo() {
  return <PostList posts={posts} />
}
