import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const CandidatesPage = lazy(() => import("@/pages/CandidatesPage"));
const CandidateDetailPage = lazy(() => import("@/pages/CandidateDetailPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64" role="status">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      <span className="sr-only">Загрузка страницы...</span>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/candidates" replace />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/candidate/:id" element={<CandidateDetailPage />} />
        <Route
          path="*"
          element={
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800">404</h2>
              <p className="text-gray-500 mt-2">Страница не найдена</p>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
