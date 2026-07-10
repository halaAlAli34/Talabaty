import { useParams, Link } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";

export default function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <div className="min-vh-100 bg-surface">
      <PublicNavbar />
      <div className="d-flex align-items-center justify-content-center px-3" style={{ minHeight: "70vh" }}>
        <div className="w-100 rounded-xl2 bg-white p-4 p-md-5 text-center shadow-card" style={{ maxWidth: "24rem" }}>
          <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-teal-50" style={{ width: "3.5rem", height: "3.5rem" }}>
            <i className="ti ti-check fs-3 text-teal-500" aria-hidden="true" />
          </div>
          <h1 className="fs-4 fw-bold text-navy-900">Order placed!</h1>
          <p className="mt-1 small text-slate-500">
            Order #{orderId?.slice(-6).toUpperCase()}
          </p>
          <p className="mt-3 small text-slate-500">
            We're arranging delivery. Our team will call you shortly to confirm your order.
          </p>
          <Link
            to="/orders"
            className="btn btn-brand w-100 mt-4 py-2 fw-semibold"
          >
            View my orders
          </Link>
        </div>
      </div>
    </div>
  );
}
