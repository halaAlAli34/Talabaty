import { useMemo, useState } from "react";
import {
  FiSearch,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

type Status = "Pending" | "Preparing" | "Delivered" | "Cancelled";

type Order = {
  id: number;
  orderId: string;
  customer: string;
  items: string;
  total: number;
  status: Status;
  time: string;
};

const PartnerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderId: "#1001",
      customer: "Ahmad Ali",
      items: "Burger, Fries",
      total: 12,
      status: "Pending",
      time: "2 min ago",
    },
    {
      id: 2,
      orderId: "#1002",
      customer: "Sarah Hassan",
      items: "Pizza, Cola",
      total: 18,
      status: "Preparing",
      time: "10 min ago",
    },
    {
      id: 3,
      orderId: "#1003",
      customer: "Mohammad Karim",
      items: "Shawarma",
      total: 8,
      status: "Delivered",
      time: "30 min ago",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  /* =========================
     ACTIONS
  ========================= */

  const acceptOrder = (id: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "Preparing" } : o
      )
    );
  };

  const rejectOrder = (id: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "Cancelled" } : o
      )
    );
  };

  const markDelivered = (id: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "Delivered" } : o
      )
    );
  };

  /* =========================
     FILTERING
  ========================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.orderId.includes(search);

      const matchFilter = filter === "All" || o.status === filter;

      return matchSearch && matchFilter;
    });
  }, [orders, search, filter]);

  /* =========================
     STATUS STYLE
  ========================= */

  const getStatusClass = (status: Status) => {
    switch (status) {
      case "Delivered":
        return "status-delivered";
      case "Pending":
        return "status-pending";
      case "Preparing":
        return "status-preparing";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="orders-page">

      {/* HEADER */}
      <div className="page-header">
        <h2>Orders</h2>
        <p>Manage incoming customer orders in real time</p>
      </div>

      {/* STATS */}
      <div className="orders-stats">

        <div className="stat">
          <FiPackage />
          <div>
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat">
          <FiClock />
          <div>
            <h3>{orders.filter(o => o.status === "Pending").length}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat">
          <FiPackage />
          <div>
            <h3>{orders.filter(o => o.status === "Preparing").length}</h3>
            <p>Preparing</p>
          </div>
        </div>

        <div className="stat">
          <FiCheckCircle />
          <div>
            <h3>{orders.filter(o => o.status === "Delivered").length}</h3>
            <p>Delivered</p>
          </div>
        </div>

      </div>

      {/* FILTERS */}
      <div className="orders-filters">

        <div className="search-box">
          <FiSearch />
          <input
            placeholder="Search order or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Preparing</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

      </div>

      {/* ORDERS */}
      <div className="orders-list">

        {filteredOrders.map((order) => (
          <div className="order-card" key={order.id}>

            <div className="order-top">
              <h4>{order.orderId}</h4>
              <span className={getStatusClass(order.status)}>
                {order.status}
              </span>
            </div>

            <div className="order-body">
              <p><b>Customer:</b> {order.customer}</p>
              <p><b>Items:</b> {order.items}</p>
              <p><b>Total:</b> ${order.total}</p>
              <p className="time">{order.time}</p>
            </div>

            {/* ACTIONS */}
            <div className="order-actions">

              {order.status === "Pending" && (
                <>
                  <button
                    className="update"
                    onClick={() => acceptOrder(order.id)}
                  >
                    Accept
                  </button>

                  <button
                    className="delete"
                    onClick={() => rejectOrder(order.id)}
                  >
                    Reject
                  </button>
                </>
              )}

              {order.status === "Preparing" && (
                <button
                  className="view"
                  onClick={() => markDelivered(order.id)}
                >
                  Mark Delivered
                </button>
              )}

              {order.status === "Delivered" && (
                <button disabled className="view">
                  Completed
                </button>
              )}

              {order.status === "Cancelled" && (
                <button disabled className="delete">
                  Cancelled
                </button>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default PartnerOrders;