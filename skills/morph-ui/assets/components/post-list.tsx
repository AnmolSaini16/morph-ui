"use client"

import {
  addTransitionType,
  startTransition,
  useLayoutEffect,
  useId,
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
const ArrowLeft = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M13 8H3.5" />
    <path d="M7.5 4 3.5 8l4 4" />
  </svg>
)

export type Post = {
  id: string
  title: string
  excerpt: string
  body: string
  author: string
  date: string
  readTime: string
  cover: string
  coverFilter?: string
}

function Cover({ post, className }: { post: Post; className: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div
        className={`absolute inset-0 ${post.coverFilter ? "scale-110" : ""}`}
        style={{ background: post.cover, filter: post.coverFilter }}
      />
    </div>
  )
}

const card =
  "rounded-xl bg-card text-sm text-card-foreground ring-1 ring-foreground/10 [&[style*=view-transition-name]]:ring-0"

export function PostList({ posts }: { posts: Post[] }) {
  const id = useId()
  const [active, setActive] = useState<Post | null>(null)
  const back = useRef<HTMLButtonElement>(null)
  const rows = useRef(new Map<string, HTMLButtonElement>())
  const lastOpened = useRef<string | null>(null)
  const name = (post: Post, part: string) => `${id}-${part}-${post.id}`

  const open = (post: Post) => {
    lastOpened.current = post.id
    document.activeViewTransition?.skipTransition()
    startTransition(() => setActive(post))
  }
  const close = () => {
    document.activeViewTransition?.skipTransition()
    startTransition(() => {
      addTransitionType("post-close")
      setActive(null)
    })
  }

  useLayoutEffect(() => {
    if (active) back.current?.focus({ preventScroll: true })
    else if (lastOpened.current)
      rows.current.get(lastOpened.current)?.focus({ preventScroll: true })
  }, [active])

  return (
    <div className="relative h-[29rem] w-full max-w-lg pt-12 text-foreground">
      <button
        ref={back}
        type="button"
        onClick={close}
        disabled={!active}
        tabIndex={active ? 0 : -1}
        aria-hidden={!active}
        className={`absolute top-0 left-0 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-secondary px-2.5 text-sm font-medium text-secondary-foreground outline-none transition-opacity duration-200 ease-out motion-reduce:transition-none focus-visible:ring-3 focus-visible:ring-ring/50 hover:bg-secondary/80 [&_svg]:size-3.5 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ArrowLeft /> All posts
      </button>
      {active ? (
        <ViewTransition key="post" default="none">
          <div className="h-full">
            <ViewTransition
              name={name(active, "shell")}
              share={{ "post-close": "vt-move vt-expand vt-quick", default: "vt-move vt-expand" }}
            >
              <article className={`flex h-full flex-col overflow-hidden p-3 ${card}`}>
                <ViewTransition
                  name={name(active, "cover")}
                  share={{ "post-close": "vt-move vt-cover vt-quick", default: "vt-move vt-cover" }}
                >
                  <Cover post={active} className="h-40 shrink-0" />
                </ViewTransition>
                <div className="px-2 pt-4">
                  <p className="text-xs text-muted-foreground">
                    {active.date}
                    <span aria-hidden className="mx-1.5">
                      ·
                    </span>
                    {active.readTime}
                  </p>
                  <ViewTransition
                    name={name(active, "title")}
                    share={{ "post-close": "vt-move vt-text vt-quick", default: "vt-move vt-text" }}
                  >
                    <h3 className="mt-1.5 w-fit text-base leading-6 font-semibold tracking-tight">
                      {active.title}
                    </h3>
                  </ViewTransition>
                  <p className="mt-1 text-muted-foreground">By {active.author}</p>
                  <p className="mt-4 leading-relaxed">{active.body}</p>
                </div>
              </article>
            </ViewTransition>
          </div>
        </ViewTransition>
      ) : (
        <ViewTransition
          key="list"
          enter={{ "post-close": "none", default: "vt-blur" }}
          exit="vt-blur"
        >
          <ul className="flex flex-col gap-2">
            {posts.map((post) => (
              <li key={post.id}>
                <button
                  ref={(el) => {
                    if (el) rows.current.set(post.id, el)
                    else rows.current.delete(post.id)
                  }}
                  type="button"
                  onClick={() => open(post)}
                  className="w-full cursor-pointer rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <ViewTransition
                    name={name(post, "shell")}
                    share={{
                      "post-close": "vt-move vt-expand vt-quick",
                      default: "vt-move vt-expand",
                    }}
                  >
                    <div
                      className={`flex items-center gap-4 p-3 transition-shadow hover:ring-foreground/20 ${card}`}
                    >
                      <ViewTransition
                        name={name(post, "cover")}
                        share={{
                          "post-close": "vt-move vt-cover vt-quick",
                          default: "vt-move vt-cover",
                        }}
                      >
                        <Cover post={post} className="size-16 shrink-0" />
                      </ViewTransition>
                      <div className="min-w-0 flex-1">
                        <ViewTransition
                          name={name(post, "title")}
                          share={{
                            "post-close": "vt-move vt-text vt-quick",
                            default: "vt-move vt-text",
                          }}
                        >
                          <h3 className="w-fit text-base leading-6 font-semibold tracking-tight">
                            {post.title}
                          </h3>
                        </ViewTransition>
                        <p className="mt-0.5 truncate text-muted-foreground">{post.excerpt}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {post.date}
                          <span aria-hidden className="mx-1.5">
                            ·
                          </span>
                          {post.readTime}
                        </p>
                      </div>
                    </div>
                  </ViewTransition>
                </button>
              </li>
            ))}
          </ul>
        </ViewTransition>
      )}
    </div>
  )
}
