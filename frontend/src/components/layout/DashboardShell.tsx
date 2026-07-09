import { useState } from "react";
import logo from "../../assets/T logo.png";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiGrid,
  FiShoppingBag,
  FiClipboard,
  FiBell,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";

const DashboardShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-wrapper">

      {/* Mobile Overlay */}

      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "show-overlay" : ""
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}

      <aside
        className={`partner-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        {/* Logo */}

        <div className="sidebar-logo">

          <div className="logo-circle">
            T
          </div>

          <div>

            <h4>Talabaty</h4>

            <span>Partner Panel</span>

          </div>

        </div>

        {/* Navigation */}

        <nav className="sidebar-nav">

          <NavLink
            to="/partner/dashboard"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >
            <FiGrid />

            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/partner/items"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >
            <FiShoppingBag />

            <span>My Items</span>
          </NavLink>

          <NavLink
            to="/partner/orders"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >
            <FiClipboard />

            <span>Orders</span>
          </NavLink>

        </nav>

        {/* Footer */}

        <div className="sidebar-footer">

          <div className="restaurant-info">

            <div className="restaurant-avatar">
              T
            </div>

            <div>

              <h6 className="mb-0">
                Talabaty Restaurant
              </h6>

              <small>Partner Account</small>

            </div>

          </div>

          <button
            className="btn btn-danger logout-button w-100"
            type="button"
          >
            <FiLogOut className="me-2" />

            Logout
          </button>

        </div>

      </aside>

      {/* Main */}

      <div className="dashboard-main">

        {/* Header */}

        <header className="dashboard-header">

          <div className="d-flex align-items-center">

            <button
              className="menu-button"
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
            >
              {sidebarOpen ? (
                <FiX />
              ) : (
                <FiMenu />
              )}
            </button>

            <div>

              <h3 className="page-title">
                Partner Dashboard
              </h3>

              <p className="page-subtitle">
                Manage your restaurant, menu and
                customer orders.
              </p>

            </div>

          </div>

          <div className="header-right">

            <button className="notification-button">

              <FiBell />

            </button>

            <div className="partner-profile">

              <div className="partner-avatar">

                T

              </div>

              <div>

                <h6 className="mb-0">
                  Talabaty
                </h6>

                <small>Restaurant</small>

              </div>

            </div>

          </div>

        </header>

        {/* Dynamic Page */}

        <main className="dashboard-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default DashboardShell;