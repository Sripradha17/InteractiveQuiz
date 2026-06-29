import { useEffect, useState } from "react";

const COLORS = ["#6c5ce7", "#fd79a8", "#fdcb6e", "#00b894", "#0984e3", "#e17055"];

// A short-lived burst of confetti pieces, identified by `burstId` so a new
// burst (even with the same count) always replays the animation.
export default function Confetti({ burstId, count }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!burstId) return;
    const next = Array.from({ length: count }, (_, i) => ({
      id: `${burstId}-${i}`,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 1 + Math.random() * 1.2,
      delay: Math.random() * 0.3,
    }));
    setPieces(next);
    const cleanup = setTimeout(() => setPieces([]), 3000);
    return () => clearTimeout(cleanup);
  }, [burstId, count]);

  if (pieces.length === 0) return null;

  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}
