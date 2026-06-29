import { useEffect, useState } from "react";
import { BotAIcon, BotBIcon } from "./icons/BotIcons";

const OPENERS = [
  "Ooh, tell me something cool about this one!",
  "Quick fact break before we move on!",
  "Wait, I have a fun fact about this...",
  "Here's something neat related to that:",
  "Hang on, this reminds me of something!",
];

const REACTIONS = [
  "Whoa, I did not know that!",
  "That's wild. Love it.",
  "Okay that's actually so cool.",
  "Huh, mind blown.",
  "No way! That's a good one.",
];

function pickRandom(list, seed) {
  return list[seed % list.length];
}

// Two illustrated bots exchange a short, animated chat about a fun fact
// related to the question just answered. The opener/reaction lines are
// generic and randomized; the middle line is the actual fact from the
// question data, so this works for any of the ~1700 questions without
// needing per-question dialogue written by hand.
export default function BotConversation({ fact, conversationKey }) {
  const [stage, setStage] = useState(0); // 0 none, 1 typingA, 2 bubbleA, 3 typingB, 4 bubbleB, 5 typingA2, 6 bubbleA2

  useEffect(() => {
    setStage(0);
    if (!fact) return;
    const timers = [
      setTimeout(() => setStage(1), 150),
      setTimeout(() => setStage(2), 700),
      setTimeout(() => setStage(3), 1100),
      setTimeout(() => setStage(4), 1700),
      setTimeout(() => setStage(5), 2300 + Math.min(fact.length * 12, 1800)),
      setTimeout(() => setStage(6), 2700 + Math.min(fact.length * 12, 1800)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [fact, conversationKey]);

  if (!fact) return null;

  const opener = pickRandom(OPENERS, conversationKey);
  const reaction = pickRandom(REACTIONS, conversationKey + 1);

  return (
    <div className="bot-conversation">
      {stage >= 1 && (
        <div className="bot-row bot-row-a">
          <span className="bot-avatar">
            <BotAIcon />
          </span>
          {stage === 1 ? (
            <span className="bot-bubble typing">
              <i></i><i></i><i></i>
            </span>
          ) : (
            <span className="bot-bubble bubble-a">{opener}</span>
          )}
        </div>
      )}
      {stage >= 3 && (
        <div className="bot-row bot-row-b">
          {stage === 3 ? (
            <span className="bot-bubble typing">
              <i></i><i></i><i></i>
            </span>
          ) : (
            <span className="bot-bubble bubble-b">{fact}</span>
          )}
          <span className="bot-avatar">
            <BotBIcon />
          </span>
        </div>
      )}
      {stage >= 5 && (
        <div className="bot-row bot-row-a">
          <span className="bot-avatar">
            <BotAIcon />
          </span>
          {stage === 5 ? (
            <span className="bot-bubble typing">
              <i></i><i></i><i></i>
            </span>
          ) : (
            <span className="bot-bubble bubble-a">{reaction}</span>
          )}
        </div>
      )}
    </div>
  );
}
