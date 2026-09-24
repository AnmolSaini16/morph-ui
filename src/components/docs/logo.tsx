export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <rect
        x="3"
        y="3"
        width="17"
        height="17"
        rx="5"
        className="stroke-brand"
        strokeWidth="1.75"
        strokeDasharray="3 3"
      />
      <rect x="12" y="12" width="17" height="17" rx="5" className="fill-brand" />
    </svg>
  )
}
