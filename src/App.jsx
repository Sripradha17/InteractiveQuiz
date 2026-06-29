import { useState } from "react";
import CategoryGrid from "./components/CategoryGrid";
import QuizModal from "./components/QuizModal";
import { QUIZ_DATA, SUBJECTS } from "./data/quizData";

export default function App() {
  const [openSubject, setOpenSubject] = useState(null);

  return (
    <>
      <h1 className="title">Choose a Quiz Category</h1>

      <CategoryGrid subjects={SUBJECTS} onSelect={setOpenSubject} />

      {openSubject && (
        <QuizModal
          subject={openSubject}
          quizData={QUIZ_DATA[openSubject]}
          onClose={() => setOpenSubject(null)}
        />
      )}
    </>
  );
}
