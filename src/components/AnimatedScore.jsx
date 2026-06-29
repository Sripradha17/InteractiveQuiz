import { useEffect, useRef, useState } from "react";

// Counts up from 0 to `value` over ~700ms whenever `value` changes.
export default function AnimatedScore({ value }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const durationMs = 700;

    function tick(now) {
      const progress = Math.min(1, (now - start) / durationMs);
      setDisplay(Math.round(progress * value));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <strong className="score-number">{display}</strong>;
}
