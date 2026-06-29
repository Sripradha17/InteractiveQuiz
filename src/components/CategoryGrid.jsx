import SubjectCard from "./SubjectCard";

export default function CategoryGrid({ subjects, onSelect }) {
  return (
    <div className="card-grid">
      {subjects.map((subject) => (
        <SubjectCard key={subject} subject={subject} onSelect={onSelect} />
      ))}
    </div>
  );
}
