import { useEffect, useMemo, useState } from "react";
import "./ReservationsPage.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function buildTimeOptions() {
  const options = [];
  const now = new Date();
  for (let d = 0; d < 14; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    day.setHours(0, 0, 0, 0);
    const dayOfWeek = day.getDay();
    const isSunday = dayOfWeek === 0;
    const startHour = 17;
    const endHour = isSunday ? 21 : 23;
    for (let hour = startHour; hour < endHour; hour++) {
      for (const minute of [0, 30]) {
        const slot = new Date(day);
        slot.setHours(hour, minute, 0, 0);
        if (slot <= now) continue;
        const label = slot.toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
        // FIX: Build a local ISO string (YYYY-MM-DDTHH:mm) instead of using UTC .toISOString()
        const year = slot.getFullYear();
        const month = String(slot.getMonth() + 1).padStart(2, '0');
        const dateStr = String(slot.getDate()).padStart(2, '0');
        const hourStr = String(slot.getHours()).padStart(2, '0');
        const minStr = String(slot.getMinutes()).padStart(2, '0');
        const localIsoValue = `${year}-${month}-${dateStr}T${hourStr}:${minStr}`;

        options.push({
          value: localIsoValue,
          label,
        });
      }
    }
  }
  return options;
}

export default function ReservationsPage() {
  const timeOptions = useMemo(() => buildTimeOptions(), []);
  const [form, setForm] = useState({
    time_slot: timeOptions[0]?.value || "",
    num_guests: "2",
    customer_name: "",
    email_address: "",
    phone_number: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    const initial = timeOptions[0]?.value;
    if (initial) checkAvailability(initial);
  }, [timeOptions]);

  async function checkAvailability(isoLocal) {
    if (!isoLocal) return;
    const iso = new Date(isoLocal).toISOString();
    try {
      const res = await fetch(
        `/api/reservations/availability?time_slot=${encodeURIComponent(iso)}`
      );
      const data = await res.json();
      if (res.ok) setAvailability(data);
    } catch {
      setAvailability(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.time_slot) {
      setStatus({ type: "error", message: "Please select a time slot." });
      return;
    }
    if (!form.customer_name.trim()) {
      setStatus({ type: "error", message: "Please enter your name." });
      return;
    }
    if (!EMAIL_RE.test(form.email_address.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email." });
      return;
    }
    const phoneDigits = form.phone_number.replace(/\D/g, "");
    if (phoneDigits.length > 0 && phoneDigits.length !== 10) {
      setStatus({
        type: "error",
        message: "Please enter a complete 10-digit phone number.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          time_slot: form.time_slot,
          num_guests: Number(form.num_guests),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({
          type: "error",
          message: data.error || "Could not complete reservation.",
        });
        return;
      }
      setStatus({
        type: "success",
        message: `${data.message} Table ${data.reservation.table_number} on ${new Date(data.reservation.time_slot).toLocaleString()}.`,
      });
      checkAvailability(form.time_slot);
    } catch {
      setStatus({
        type: "error",
        message: "Unable to reach the server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page reservations-page">
      <header className="page-header">
        <h1>Reservations</h1>
        <p>Book your table online. We hold 30 tables per service period.</p>
      </header>

      <form className="reservation-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="time_slot">Date &amp; time</label>
          <select
            id="time_slot"
            value={form.time_slot}
            onChange={(e) => {
              updateField("time_slot", e.target.value);
              checkAvailability(e.target.value);
            }}
            required
          >
            {timeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {availability && (
            <p className="availability-hint">
              {availability.available
                ? `${availability.tables_remaining} table(s) still available`
                : "This slot is fully booked"}
            </p>
          )}
        </div>

        <div className="form-row">
          <label htmlFor="num_guests">Number of guests</label>
          <input
            id="num_guests"
            type="number"
            min={1}
            max={12}
            value={form.num_guests}
            onChange={(e) => updateField("num_guests", e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="customer_name">Name</label>
          <input
            id="customer_name"
            type="text"
            value={form.customer_name}
            onChange={(e) => updateField("customer_name", e.target.value)}
            placeholder="John Doe"
            required
            autoComplete="name"
          />
        </div>

        <div className="form-row">
          <label htmlFor="email_address">Email</label>
          <input
            id="email_address"
            type="email"
            value={form.email_address}
            onChange={(e) => updateField("email_address", e.target.value)}
            placeholder="name@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-row">
          <label htmlFor="phone_number">Phone (optional)</label>
          <input
            id="phone_number"
            type="tel"
            value={form.phone_number}
            onChange={(e) =>
              updateField("phone_number", formatPhoneNumber(e.target.value))
            }
            placeholder="(202) 555-4567"
            inputMode="tel"
            autoComplete="tel"
            maxLength={14}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Booking…" : "Confirm reservation"}
        </button>

        {status.message && (
          <p
            className={`form-status ${status.type}`}
            role={status.type === "error" ? "alert" : "status"}
          >
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}
