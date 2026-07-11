import { useEffect, useState, FormEvent } from "react";
import CustomerShell from "../../components/layout/CustomerShell";
import api from "../../api/axiosInstance";
import { PaymentMethod } from "../../types";

function methodIcon(type: string): string {
  return type === "Whish" ? "ti-wallet" : "ti-truck-delivery";
}

export default function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [type, setType] = useState<"Cash" | "Whish">("Cash");
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
      await api.post("/payment-methods", { type, label, phoneNumber: type === "Whish" ? phoneNumber : undefined });
      setType("Cash");
      setLabel("");
      setPhoneNumber("");
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
          <p className="text-slate-500 mb-0">Save how you like to pay, and pick your default for checkout.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn btn-brand fw-semibold">
          {showForm ? "Cancel" : "+ Add method"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl2 bg-white p-4 shadow-card mb-4">
          {error && <p className="rounded-3 bg-red-50 px-3 py-2 small text-red-600">{error}</p>}

          <div className="row row-cols-1 row-cols-sm-2 g-2 mb-3">
            <div className="col">
              <button
                type="button"
                onClick={() => setType("Cash")}
                className={`btn w-100 d-flex align-items-center gap-2 rounded-3 border border-2 p-2 text-start fw-semibold ${
                  type === "Cash" ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-500"
                }`}
              >
                <i className="ti ti-truck-delivery" aria-hidden="true" /> Cash
              </button>
            </div>
            <div className="col">
              <button
                type="button"
                onClick={() => setType("Whish")}
                className={`btn w-100 d-flex align-items-center gap-2 rounded-3 border border-2 p-2 text-start fw-semibold ${
                  type === "Whish" ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-500"
                }`}
              >
                <i className="ti ti-wallet" aria-hidden="true" /> Whish
              </button>
            </div>
          </div>

          <div className="row g-3">
            <div className={type === "Whish" ? "col-sm-6" : "col-sm-12"}>
              <label className="d-block">
                <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Label</span>
                <div className="position-relative">
                  <i className="ti ti-tag position-absolute text-slate-400" style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
                  <input className="form-control ps-5" placeholder="e.g. My Whish, Cash on delivery" value={label} onChange={(e) => setLabel(e.target.value)} required />
                </div>
              </label>
            </div>
            {type === "Whish" && (
              <div className="col-sm-6">
                <label className="d-block">
                  <span className="mb-1 d-block small-caps fw-semibold text-slate-500" style={{ fontSize: ".75rem" }}>Whish phone number</span>
                  <div className="position-relative">
                    <i className="ti ti-phone position-absolute text-slate-400" style={{ left: ".75rem", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
                    <input className="form-control ps-5" placeholder="+961 .. ... ..." value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                  </div>
                </label>
              </div>
            )}
          </div>

          <button type="submit" disabled={saving} className="btn btn-brand fw-semibold mt-3 px-4">
            {saving ? "Saving..." : "Save method"}
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
                <i className={`ti ${methodIcon(m.type)} text-brand-600`} aria-hidden="true" />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <p className="fw-semibold text-navy-900 mb-0">{m.label}</p>
                  {m.isDefault && (
                    <span className="badge rounded-pill bg-teal-50 text-teal-700 fw-semibold">Default</span>
                  )}
                </div>
                <p className="small text-slate-500 mb-0">
                  {m.type}{m.phoneNumber ? ` \u2014 ${m.phoneNumber}` : ""}
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

      <div className="rounded-xl2 bg-brand-50 p-4 mt-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <i className="ti ti-shield-lock text-brand-600" aria-hidden="true" />
          <p className="fw-semibold text-navy-900 mb-0">Your money is safe</p>
        </div>
        <p className="small text-slate-600 mb-0">
          Talabaty doesn't store card details. Cash is collected on delivery, and Whish payments go directly through your Whish account.
        </p>
      </div>
    </CustomerShell>
  );
}
