import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/partner/Dashboard";
import MyItems from "./pages/partner/MyItems";
import PartnerOrders from "./pages/partner/PartnerOrders";
import DashboardShell from "./components/layout/DashboardShell";

export default function App() {
  return (
    <Routes>
      {/* redirect root */}
      <Route path="/" element={<Navigate to="/partner/dashboard" replace />} />

      <Route path="/partner" element={<DashboardShell />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="items" element={<MyItems />} />
        <Route path="orders" element={<PartnerOrders />} />
      </Route>
    </Routes>
  );
}