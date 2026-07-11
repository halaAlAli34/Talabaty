const styles: Record<string, string> = {
  active: "bg-teal-50 text-teal-700",
  frozen: "bg-amber-50 text-amber-700",
  pending: "bg-amber-50 text-amber-700",
  new: "bg-amber-50 text-amber-700",
  "in progress": "bg-blue-50 text-blue-700",
  completed: "bg-teal-50 text-teal-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function StatusPill({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span className={`badge rounded-pill fw-semibold text-capitalize ${styles[key] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}
