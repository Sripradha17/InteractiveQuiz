import { useCallback, useState } from "react";

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

function playTone(frequency, duration, type, delay, volume, enabled) {
  if (!enabled) return;
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const startTime = ctx.currentTime + delay;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// Web Audio API tone generator for all sound effects - no audio files needed.
// Mute preference persists across visits via localStorage.
export function useSound() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem("quizSoundEnabled") !== "false");

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("quizSoundEnabled", String(next));
      if (next) playTone(440, 0.05, "square", 0, 0.05, true);
      return next;
    });
  }, []);

  const playClick = useCallback(() => playTone(440, 0.05, "square", 0, 0.05, enabled), [enabled]);

  const playCorrect = useCallback(() => {
    playTone(523.25, 0.12, "sine", 0, 0.16, enabled);
    playTone(659.25, 0.15, "sine", 0.1, 0.16, enabled);
    playTone(783.99, 0.2, "sine", 0.2, 0.16, enabled);
  }, [enabled]);

  const playIncorrect = useCallback(() => {
    playTone(220, 0.25, "sawtooth", 0, 0.1, enabled);
    playTone(170, 0.3, "sawtooth", 0.12, 0.1, enabled);
  }, [enabled]);

  const playFanfare = useCallback(() => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => playTone(freq, 0.22, "sine", i * 0.12, 0.16, enabled));
  }, [enabled]);

  return { enabled, toggle, playClick, playCorrect, playIncorrect, playFanfare };
}
