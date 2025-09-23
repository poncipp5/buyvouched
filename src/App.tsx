import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import MangaDetailsPage from "./components/MangaDetailsPage";
import MangaReaderPage from "./components/MangaReaderPage";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manga/:id" element={<MangaDetailsPage />} />
          <Route path="/reader/:id" element={<MangaReaderPage />} />
          <Route path="/reader/:id/:chapterId" element={<MangaReaderPage />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
