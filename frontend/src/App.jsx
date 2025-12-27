import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateRequest from "./pages/CreateRequest";
import Kanban from "./pages/Kanban";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard = landing page */}
        <Route path="/" element={<Dashboard />} />

        {/* Create maintenance request */}
        <Route path="/request" element={<CreateRequest />} />

        {/* Kanban workflow */}
        <Route path="/kanban" element={<Kanban />} />
      </Routes>
    </BrowserRouter>
  );
}
