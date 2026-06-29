import Science from "../../questions/Science.json";
import History from "../../questions/History.json";
import Geography from "../../questions/Geography.json";
import Literature from "../../questions/Literature.json";
import Math_ from "../../questions/Math.json";
import Sports from "../../questions/Sports.json";
import Technology from "../../questions/Technology.json";
import Movies from "../../questions/Movies.json";
import Music from "../../questions/Music.json";
import Art from "../../questions/Art.json";
import Animals from "../../questions/Animals.json";
import Space from "../../questions/Space.json";

// Source of truth for quiz content stays in questions/*.json at the repo root;
// Vite bundles these JSON imports at build time (and serves them live in dev),
// so no fetch() or generated bundle file is needed.
export const QUIZ_DATA = {
  Science,
  History,
  Geography,
  Literature,
  Math: Math_,
  Sports,
  Technology,
  Movies,
  Music,
  Art,
  Animals,
  Space,
};

export const SUBJECTS = Object.keys(QUIZ_DATA);
