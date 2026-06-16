import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes";
import { BrowserRouter } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-300 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2">
            <span className="font-bold text-indigo-600 text-lg">CV-Scan</span>
            <span className="text-gray-400 text-sm">/ Candidate Dashboard</span>
          </div>
        </nav>

        <AppRoutes />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />
    </BrowserRouter>
  );
}
