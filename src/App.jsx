import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Pockets from "./pages/Pockets";
import AddTransaction from "./pages/AddTransaction";
import History from "./pages/History";
import About from "./pages/About";
import { lazy, Suspense } from "react";
const Summary = lazy(() => import("./pages/Summary"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pockets" element={<Pockets />} />
            <Route path="/add" element={<AddTransaction key="new" />} />
            <Route path="/edit/:id" element={<AddTransaction key="edit" />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/summary"
              element={
                <Suspense
                  fallback={
                    <p className="p-8 text-center text-sm border-line">
                      Memuat...
                    </p>
                  }
                >
                  <Summary />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
