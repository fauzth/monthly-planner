import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/layout/BottomNav";
import Home from "./pages/Home";
import Pockets from "./pages/Pockets";
import AddTransaction from "./pages/AddTransaction";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pockets" element={<Pockets />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/history" element={<History />} />
        </Routes>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
