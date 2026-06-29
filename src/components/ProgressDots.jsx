// Row of dots showing progress through the question set: dim = upcoming,
// big/highlighted = current, green/red = answered correct/incorrect.
export default function ProgressDots({ results, currentIndex }) {
  return (
    <div className="progress-dots">
      {results.map((result, index) => {
        const classes = ["progress-dot"];
        if (index === currentIndex) classes.push("current");
        else if (result === "correct") classes.push("correct");
        else if (result === "incorrect") classes.push("incorrect");
        return <span key={index} className={classes.join(" ")} />;
      })}
    </div>
  );
}
