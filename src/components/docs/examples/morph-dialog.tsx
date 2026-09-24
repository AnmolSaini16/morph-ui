"use client"

import { useState } from "react"
import { MorphDialog } from "@/registry/morph-dialog"

const icon = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const
const Pencil = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M10.75 2.75l2.5 2.5L6 12.5l-3.25.75.75-3.25z" />
    <path d="M9.25 4.25l2.5 2.5" />
  </svg>
)

const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 h-8 rounded-lg px-3 text-sm"
const input =
  "mt-1.5 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

export default function MorphDialogDemo() {
  const [profile, setProfile] = useState({ name: "Pedro Duarte", username: "peduarte" })
  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)

  return (
    <MorphDialog
      title="Edit profile"
      description="Make changes to your profile here. Click save when you're done."
      className="w-72 p-3"
      overlayClassName="md:pl-(--sidebar-width)"
      trigger={
        <span className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{profile.name}</span>
            <span className="block truncate text-xs text-muted-foreground">
              @{profile.username}
            </span>
          </span>
          <Pencil className="size-4 shrink-0 text-muted-foreground" />
        </span>
      }
    >
      {(close) => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            setProfile({
              name: String(data.get("name")).trim() || profile.name,
              username: String(data.get("username")).trim() || profile.username,
            })
            close()
          }}
        >
          <label className="block text-sm font-medium">
            Name
            <input name="name" defaultValue={profile.name} className={input} />
          </label>
          <label className="mt-3 block text-sm font-medium">
            Username
            <input name="username" defaultValue={profile.username} className={input} />
          </label>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className={`${button} bg-secondary text-secondary-foreground hover:bg-secondary/80`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${button} bg-primary text-primary-foreground hover:bg-primary/80`}
            >
              Save changes
            </button>
          </div>
        </form>
      )}
    </MorphDialog>
  )
}
