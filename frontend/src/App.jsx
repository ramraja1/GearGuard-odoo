import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateRequest from "./pages/CreateRequest";
import Kanban from "./pages/Kanban";
import RequestDetails from "./pages/RequestDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard = landing page */}
        <Route path="/" element={<Dashboard />} />

        {/* Create maintenance request */}
        <Route path="/request" element={<CreateRequest />} />
        <Route path="/requests/:id" element={<RequestDetails />} />

        {/* Kanban workflow */}
        <Route path="/kanban" element={<Kanban />} />
      </Routes>
    </BrowserRouter>
  );
}
