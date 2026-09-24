"use client"

import { Tabs, type Tab } from "@/components/tabs"

const stats = [
  ["Visitors", "12.4k"],
  ["Bounce rate", "38%"],
  ["Avg. session", "2m 41s"],
]

const activity = [
  ["Maya", "merged", "feat: onboarding flow"],
  ["Sam", "commented on", "Pricing page copy"],
  ["Lee", "deployed", "v2.3.0 to production"],
]

const tabs: Tab[] = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <div className="grid grid-cols-3 gap-2">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight tabular-nums">{value}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "activity",
    label: "Activity",
    content: (
      <ul className="space-y-2.5">
        {activity.map(([who, did, what]) => (
          <li key={what} className="flex items-center gap-2.5">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
              {who[0]}
            </span>
            <p className="min-w-0 truncate">
              <span className="font-medium">{who}</span>{" "}
              <span className="text-muted-foreground">{did}</span> {what}
            </p>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    content: (
      <div className="space-y-3">
        {["Email me about comments", "Weekly summary"].map((label, i) => (
          <label key={label} className="flex items-center justify-between gap-4">
            <span>{label}</span>
            <input type="checkbox" defaultChecked={i === 0} className="size-4 accent-foreground" />
          </label>
        ))}
      </div>
    ),
  },
  {
    id: "billing",
    label: "Billing",
    content: (
      <div>
        <p className="text-muted-foreground">Current plan</p>
        <p className="mt-1 text-lg font-semibold tracking-tight">Pro, $12 a month</p>
        <p className="mt-2 text-muted-foreground">Renews on October 1.</p>
      </div>
    ),
  },
]

export default function TabsDemo() {
  return <Tabs tabs={tabs} />
}
