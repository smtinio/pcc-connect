export function PersonIcon({ className, "aria-label": ariaLabel }: { className?: string; "aria-label"?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
      <circle cx="6" cy="3.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 11c0-2.21 2.239-4 5-4s5 1.79 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
