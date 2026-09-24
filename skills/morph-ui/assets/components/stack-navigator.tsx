"use client"

import {
  addTransitionType,
  startTransition,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
} from "react"

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
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M10 3.5 5.5 8l4.5 4.5" />
  </svg>
)
const SendHorizontal = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M2.75 2.75 13.5 8 2.75 13.25 4.5 8Z" />
    <path d="M4.5 8H8" />
  </svg>
)

export type Chat = {
  id: string
  name: string
  initials: string
  time: string
  messages: { from: "me" | "them"; text: string }[]
}

const iconButton =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-7 rounded-md [&_svg]:size-4"
const backButton = iconButton.replace("disabled:opacity-50", "disabled:opacity-0")

function Avatar({ chat, size = "size-10" }: { chat: Chat; size?: string }) {
  return (
    <span
      className={`grid ${size} shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground ring-1 ring-border`}
    >
      {chat.initials}
    </span>
  )
}

export function StackNavigator({ chats, title = "Messages" }: { chats: Chat[]; title?: string }) {
  const [open, setOpen] = useState<Chat | null>(null)
  const back = useRef<HTMLButtonElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const rows = useRef(new Map<string, HTMLButtonElement>())
  const lastOpened = useRef<string | null>(null)

  const push = (chat: Chat) => {
    lastOpened.current = chat.id
    document.activeViewTransition?.skipTransition()
    startTransition(() => {
      addTransitionType("stack-push")
      setOpen(chat)
    })
  }
  const pop = () => {
    document.activeViewTransition?.skipTransition()
    startTransition(() => {
      addTransitionType("stack-pop")
      setOpen(null)
    })
  }

  useLayoutEffect(() => {
    if (open) back.current?.focus({ preventScroll: true })
    else if (lastOpened.current)
      rows.current.get(lastOpened.current)?.focus({ preventScroll: true })
  }, [open])

  useLayoutEffect(() => {
    const el = frame.current
    const transition = document.activeViewTransition
    if (!el || !transition) return
    el.dataset.animating = ""
    transition.finished.finally(() => delete el.dataset.animating)
  }, [open])

  return (
    <div
      ref={frame}
      className="group/stack relative h-[28rem] w-full max-w-xs overflow-hidden rounded-xl border border-border bg-card text-sm text-card-foreground"
    >
      <button
        ref={back}
        type="button"
        onClick={pop}
        disabled={!open}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        aria-label="Back"
        className={`${backButton} absolute top-3.5 left-4 z-10 hover:bg-muted group-has-[[style*=view-transition-name]]/stack:opacity-0 group-data-[animating]/stack:opacity-0 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ChevronLeft />
      </button>
      <ViewTransition
        update={{
          "stack-push": "vt-push vt-clip vt-forward",
          "stack-pop": "vt-push vt-clip vt-back",
          default: "none",
        }}
      >
        <div className="flex h-full min-h-0 flex-col bg-card">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
            {open ? (
              <>
                <span
                  aria-hidden="true"
                  className="inline-flex size-7 shrink-0 items-center justify-center [&_svg]:size-4"
                >
                  <ChevronLeft />
                </span>
                <Avatar chat={open} size="size-8" />
                <p className="truncate font-medium">{open.name}</p>
              </>
            ) : (
              <p className="text-lg font-semibold tracking-tight">{title}</p>
            )}
          </header>
          {open ? (
            <>
              <div className="flex flex-1 flex-col justify-end gap-2 p-3">
                {open.messages.map((m, i) => (
                  <p
                    key={i}
                    className={
                      m.from === "me"
                        ? "max-w-[80%] self-end rounded-2xl rounded-br-md bg-primary px-3 py-2 text-primary-foreground"
                        : "max-w-[80%] self-start rounded-2xl rounded-bl-md bg-muted px-3 py-2"
                    }
                  >
                    {m.text}
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-border p-2">
                <span className="flex-1 rounded-full bg-muted px-3 py-2 text-muted-foreground">
                  Message
                </span>
                <button
                  type="button"
                  aria-label="Send"
                  className={`${iconButton} rounded-full bg-primary text-primary-foreground hover:bg-primary/80`}
                >
                  <SendHorizontal />
                </button>
              </div>
            </>
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <button
                    ref={(el) => {
                      if (el) rows.current.set(chat.id, el)
                      else rows.current.delete(chat.id)
                    }}
                    type="button"
                    onClick={() => push(chat)}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:inset-ring-2 focus-visible:inset-ring-ring/50"
                  >
                    <Avatar chat={chat} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate font-medium">{chat.name}</p>
                        <p className="shrink-0 text-xs text-muted-foreground">{chat.time}</p>
                      </div>
                      <p className="truncate text-muted-foreground">
                        {chat.messages[chat.messages.length - 1]?.text}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ViewTransition>
    </div>
  )
}
