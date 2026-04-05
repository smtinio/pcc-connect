export function MapPinIcon({ className, "aria-label": ariaLabel }: { className?: string; "aria-label"?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
      <path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6" cy="4.5" r="1" fill="currentColor" />
    </svg>
  );
}
