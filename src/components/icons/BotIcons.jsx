// Two friendly bot avatars for the fact-conversation feature. Flat vector
// style, no emoji, colors drawn from the same palette as the rest of the app.

export function BotAIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      <line x1="24" y1="10" x2="24" y2="4" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="4" r="2.2" fill="#a29bfe" />
      <rect x="8" y="10" width="32" height="28" rx="10" fill="#6c5ce7" />
      <rect x="8" y="10" width="32" height="28" rx="10" fill="url(#botAShade)" opacity="0.5" />
      <circle cx="17" cy="24" r="4" fill="#ffffff" />
      <circle cx="31" cy="24" r="4" fill="#ffffff" />
      <circle cx="17" cy="24" r="1.8" fill="#2d1b69" />
      <circle cx="31" cy="24" r="1.8" fill="#2d1b69" />
      <path d="M17 33 Q24 38 31 33" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="botAShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BotBIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="14" cy="9" r="2" fill="#00cec9" />
      <circle cx="34" cy="9" r="2" fill="#00cec9" />
      <line x1="14" y1="9" x2="18" y2="14" stroke="#00b894" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="9" x2="30" y2="14" stroke="#00b894" strokeWidth="2" strokeLinecap="round" />
      <rect x="8" y="12" width="32" height="26" rx="13" fill="#00b894" />
      <rect x="8" y="12" width="32" height="26" rx="13" fill="url(#botBShade)" opacity="0.5" />
      <ellipse cx="18" cy="25" rx="3.4" ry="4.2" fill="#ffffff" />
      <ellipse cx="30" cy="25" rx="3.4" ry="4.2" fill="#ffffff" />
      <ellipse cx="18" cy="26" rx="1.6" ry="2" fill="#0a3d34" />
      <ellipse cx="30" cy="26" rx="1.6" ry="2" fill="#0a3d34" />
      <path d="M18 33 Q24 30 30 33" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="botBShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
