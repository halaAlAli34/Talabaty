import {
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

import StatCard from "../../components/layout/StatCard";

const Dashboard = () => {
  const stats = {
    todayOrders: 24,
    revenue: 485,
    pending: 8,
    completed: 16,
    restaurant: "Pizza Palace",
    rating: 4.9,
  };

  const recentOrders = [
    {
      id: "#1201",
      customer: "Ahmad Ali",
      total: "$23",
      payment: "Cash",
      status: "Completed",
      time: "5 min ago",
    },
    {
      id: "#1202",
      customer: "Sarah Hassan",
      total: "$18",
      payment: "Card",
      status: "Preparing",
      time: "12 min ago",
    },
    {
      id: "#1203",
      customer: "Mohammad Karim",
      total: "$31",
      payment: "Cash",
      status: "Pending",
      time: "20 min ago",
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "status-badge completed";
      case "Pending":
        return "status-badge pending";
      case "Preparing":
        return "status-badge preparing";
      default:
        return "status-badge";
    }
  };

  return (
    <div className="dashboard-page">

      {/* HEADER SECTION */}
      <div className="dashboard-welcome">
        <h2>Welcome back 👋</h2>
        <p>Here’s what’s happening with your restaurant today</p>
      </div>

      {/* STATS */}
      <div className="row g-4 mt-2">
        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Today Orders"
            value={stats.todayOrders}
            subtitle="Compared to yesterday"
            icon={FiShoppingBag}
            bgColor="#2F80ED"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Revenue"
            value={`$${stats.revenue}`}
            subtitle="Today's earnings"
            icon={FiDollarSign}
            bgColor="#27AE60"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Pending"
            value={stats.pending}
            subtitle="Waiting orders"
            icon={FiClock}
            bgColor="#F2994A"
          />
        </div>

        <div className="col-lg-3 col-md-6">
          <StatCard
            title="Completed"
            value={stats.completed}
            subtitle="Delivered today"
            icon={FiCheckCircle}
            bgColor="#6FCF97"
          />
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="modern-card mt-5">
        <div className="card-header-modern">
          <h5>Recent Orders</h5>
          <span>Live updates</span>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={getStatusClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-muted">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;