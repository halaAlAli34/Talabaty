import { useEffect, useState, FormEvent } from "react";
import CustomerShell from "../../components/layout/CustomerShell";
import api from "../../api/axiosInstance";
import { PaymentMethod } from "../../types";

const typeMeta: Record<PaymentMethod["type"], { icon: string; blurb: string }> = {
  Cash: { icon: "ti-truck-delivery", blurb: "Pay with cash when your order arrives" },
  Whish: { icon: "ti-wallet", blurb: "Pay instantly from your Whish wallet" },
};

export default function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [type, setType] = useState<PaymentMethod["type"]>("Cash");
  const [label, setLabel] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api.get<PaymentMethod[]>("/payment-methods").then((res) => setMethods(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/payment-methods", {
        type,
        label: label || (type === "Cash" ? "Cash on delivery" : "Whish wallet"),
        phoneNumber: type === "Whish" ? phoneNumber : undefined,
      });
      setLabel("");
      setPhoneNumber("");
      setType("Cash");
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't save payment method");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    await api.patch(`/payment-methods/${id}/default`);
    load();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/payment-methods/${id}`);
    load();
  };

  return (
    <CustomerShell>
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="fs-3 fw-bold text-navy-900">Payment Methods</h1>
          <p className="text-slate-500 mb-0">Save how you like to pay, and pick your default at checkout.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn btn-brand fw-semibold">
          {showForm ? "Cancel" : "+ Add payment method"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl2 bg-white p-4 shadow-card mb-4">
          {error && <p className="rounded-3 bg-red-50 px-3 py-2 small text-red-600">{error}</p>}

          <div className="mb-3">
            <span className="mb-2 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Type</span>
            <div className="row row-cols-2 g-2" style={{ maxWidth: "24rem" }}>
              {(["Cash", "Whish"] as const).map((t) => (
                <div className="col" key={t}>
                  <button
                    type="button"
                    onClick={() => setType(t)}
                    className={`btn w-100 d-flex align-items-center gap-2 rounded-3 border border-2 px-3 py-2 fw-semibold ${
                      type === t ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    <i className={`ti ${typeMeta[t].icon}`} aria-hidden="true" />
                    {t}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="row g-3">
            <div className="col-sm-6">
              <label className="d-block">
                <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Label (optional)</span>
                <input
                  className="form-control"
                  placeholder={type === "Cash" ? "e.g. Cash on delivery" : "e.g. My Whish wallet"}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </label>
            </div>
            {type === "Whish" && (
              <div className="col-sm-6">
                <label className="d-block">
                  <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Whish phone number</span>
                  <input
                    className="form-control"
                    placeholder="+961 .. ... ..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </label>
              </div>
            )}
          </div>

          <button type="submit" disabled={saving} className="btn btn-brand fw-semibold mt-3 px-4">
            {saving ? "Saving..." : "Save payment method"}
          </button>
        </form>
      )}

      <div className="d-flex flex-column gap-3">
        {loading && <p className="small text-slate-400">Loading&hellip;</p>}
        {!loading && methods.length === 0 && (
          <p className="small text-slate-400">You haven't saved any payment methods yet.</p>
        )}
        {methods.map((m) => (
          <div key={m._id} className="d-flex align-items-center justify-content-between rounded-xl2 bg-white p-3 shadow-card">
            <div className="d-flex align-items-start gap-3">
              <div className="d-flex align-items-center justify-content-center rounded-3 bg-brand-50 flex-shrink-0" style={{ width: "2.5rem", height: "2.5rem" }}>
                <i className={`ti ${typeMeta[m.type].icon} text-brand-600`} aria-hidden="true" />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <p className="fw-semibold text-navy-900 mb-0">{m.label}</p>
                  {m.isDefault && (
                    <span className="badge rounded-pill bg-teal-50 text-teal-700 fw-semibold">Default</span>
                  )}
                </div>
                <p className="small text-slate-500 mb-0">
                  {m.type === "Whish" && m.phoneNumber ? m.phoneNumber : typeMeta[m.type].blurb}
                </p>
              </div>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              {!m.isDefault && (
                <button
                  onClick={() => handleSetDefault(m._id)}
                  className="btn rounded-3 border-0 bg-brand-50 text-brand-700 fw-semibold hover-bg-brand-100 py-1 px-2"
                  style={{ fontSize: ".75rem" }}
                >
                  Set as default
                </button>
              )}
              <button
                onClick={() => handleDelete(m._id)}
                className="btn rounded-3 border-0 bg-red-50 text-red-600 fw-semibold hover-bg-red-100 py-1 px-2"
                style={{ fontSize: ".75rem" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </CustomerShell>
  );
}
