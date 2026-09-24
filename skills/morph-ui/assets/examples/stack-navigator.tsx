"use client"

import { StackNavigator, type Chat } from "@/components/stack-navigator"

const chats: Chat[] = [
  {
    id: "maya",
    name: "Maya Jones",
    initials: "MJ",
    time: "9:41",
    messages: [
      { from: "them", text: "Did the new transitions ship?" },
      { from: "me", text: "Yep, live since this morning" },
      { from: "them", text: "They feel so smooth 🙌" },
    ],
  },
  {
    id: "leo",
    name: "Leo Park",
    initials: "LP",
    time: "9:12",
    messages: [
      { from: "them", text: "Lunch at 12?" },
      { from: "me", text: "Works for me" },
    ],
  },
  {
    id: "ana",
    name: "Ana Silva",
    initials: "AS",
    time: "Yesterday",
    messages: [
      { from: "me", text: "Sent you the design review notes" },
      { from: "them", text: "Thanks! Reading now" },
    ],
  },
  {
    id: "design",
    name: "Design team",
    initials: "DT",
    time: "Mon",
    messages: [{ from: "them", text: "Crit moved to Thursday" }],
  },
]

export default function StackNavigatorDemo() {
  return <StackNavigator chats={chats} />
}
