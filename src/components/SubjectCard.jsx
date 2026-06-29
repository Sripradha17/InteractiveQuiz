// Real image per subject, served from public/images/. The first 8 are the
// project's original photos/GIFs; the last 4 (Music, Art, Animals, Space)
// are freely-licensed photos from Wikimedia Commons (NASA imagery and a
// public-domain painting for Space/Art; CC-licensed photos for Music/Animals).
const SUBJECT_IMAGE = {
  Science: "science.gif",
  History: "history.gif",
  Geography: "geography.gif",
  Literature: "literature.gif",
  Math: "math.gif",
  Sports: "sports.gif",
  Technology: "technology.gif",
  Movies: "movie.gif",
  Music: "music.jpg",
  Art: "art.jpg",
  Animals: "animals.jpg",
  Space: "space.jpg",
};

export default function SubjectCard({ subject, onSelect }) {
  function handleActivate() {
    onSelect(subject);
  }

  const src = `${import.meta.env.BASE_URL}images/${SUBJECT_IMAGE[subject]}`;

  return (
    <div
      className="card"
      data-subject={subject}
      role="button"
      tabIndex={0}
      aria-label={`Start ${subject} quiz`}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
    >
      <div className="card-visual">
        <img className="card-image" src={src} alt={subject} />
      </div>
      <div className="card-content">
        <h2>{subject}</h2>
      </div>
    </div>
  );
}
