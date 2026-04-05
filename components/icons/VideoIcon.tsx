export function VideoIcon({ className, "aria-label": ariaLabel }: { className?: string; "aria-label"?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
      <rect x="1" y="3" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5l3-1.5v5L8 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
