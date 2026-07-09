import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: "ti-home" },
  { label: "Orders", to: "/orders", icon: "ti-package" },
  { label: "Addresses", to: "/addresses", icon: "ti-map-pin" },
  { label: "Payment Methods", to: "/payment-methods", icon: "ti-credit-card" },
  { label: "Profile", to: "/profile", icon: "ti-user" },
  { label: "Settings", to: "/settings", icon: "ti-settings" },
  { label: "Help & Support", to: "/support", icon: "ti-help-circle" },
];

// Light sidebar shell for the customer-facing dashboard — distinct from
// the dark DashboardShell used by admin/partner panels, matching the
// customer dashboard mockup (white sidebar, light-blue active state).
export default function CustomerShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex min-vh-100 bg-surface">
      <aside className="d-flex flex-shrink-0 flex-column border-end bg-white px-3 py-4" style={{ width: "15rem" }}>
        <div className="d-flex align-items-center gap-2 px-2 mb-4">
          <span className="d-flex align-items-center justify-content-center rounded-3 bg-brand-600 text-white" style={{ width: "2rem", height: "2rem" }}>
            <i className="ti ti-truck-delivery" aria-hidden="true" />
          </span>
          <span className="fw-bold text-navy-900">Talabaty</span>
        </div>

        <nav className="flex-grow-1 d-flex flex-column gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 rounded-3 px-3 py-2 text-decoration-none small fw-medium ${
                  isActive ? "bg-brand-50 text-brand-600" : "text-slate-500 hover-bg-slate-50"
                }`
              }
            >
              <i className={`ti ${item.icon}`} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="btn d-flex align-items-center gap-2 rounded-3 px-3 py-2 text-start small fw-medium text-slate-500 hover-bg-slate-50 border-0"
        >
          <i className="ti ti-logout" aria-hidden="true" />
          Logout
        </button>
      </aside>

      <div className="flex-grow-1">
        <header className="d-flex align-items-center justify-content-end gap-3 border-bottom bg-white px-4 py-2">
          <button className="btn d-flex align-items-center justify-content-center rounded-3 text-slate-400 border-0" style={{ width: "2.25rem", height: "2.25rem" }} aria-label="Search">
            <i className="ti ti-search" aria-hidden="true" />
          </button>
          <div className="d-flex align-items-center gap-2">
            <span className="d-flex align-items-center justify-content-center rounded-circle bg-brand-100 fw-bold text-brand-600" style={{ width: "2rem", height: "2rem" }}>
              {user?.name?.[0] ?? "U"}
            </span>
            <div className="small lh-sm">
              <p className="fw-semibold text-navy-900 mb-0">{user?.name}</p>
              <p className="text-slate-400 mb-0" style={{ fontSize: ".75rem" }}>Customer</p>
            </div>
          </div>
        </header>
        <main className="px-4 py-4">{children}</main>
      </div>
    </div>
  );
}
