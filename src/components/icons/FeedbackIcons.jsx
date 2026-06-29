// Small static SVG icons used in place of emoji for feedback states.

export function CorrectIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2.5">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IncorrectIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2.5">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TimeoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrophyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="1.6">
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z" />
      <path d="M7 5H4a2 2 0 0 0 0 4h1M17 5h3a2 2 0 0 1 0 4h-1" strokeLinecap="round" />
    </svg>
  );
}

export function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22c-4.5 0-8-3.2-8-7.5C4 9 8 5 9.5 2c.3 3 2 4.5 3 4.5 1.3 0 2-1.3 2-2.8C17 6 20 10 20 14.5 20 18.8 16.5 22 12 22z"
        fill="#ff9f43"
      />
      <path
        d="M12 19c-2 0-3.7-1.5-3.7-3.6 0-2 1.7-3.4 2.4-5 .1 1.4 1 2.3 1.6 2.3.7 0 1-.7 1-1.5.9 1.3 2.4 3 2.4 4.7 0 2-1.7 3.1-3.7 3.1z"
        fill="#ffd93d"
      />
    </svg>
  );
}

export function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 5V4L8 9H4z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
      <path d="M18.5 6.5a8 8 0 0 1 0 11" />
    </svg>
  );
}

export function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 5V4L8 9H4z" />
      <line x1="16" y1="9" x2="21" y2="14" />
      <line x1="21" y1="9" x2="16" y2="14" />
    </svg>
  );
}
