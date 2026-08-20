type DirhamMarkProps = { className?: string };

/** A compact UAE-dirham inspired currency glyph rendered as a mark, not text. */
export function DirhamMark({ className = "" }: DirhamMarkProps) {
  return <svg className={`dirham-mark ${className}`.trim()} viewBox="0 0 32 36" role="img" aria-label="UAE dirham">
    <path d="M7 4h8.5c7 0 11.5 5.4 11.5 14S22.5 32 15.5 32H7z" />
    <path d="M7 4v28M3 13h18M3 21h18" />
  </svg>;
}
