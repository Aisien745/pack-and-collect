"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  PackagePlus,
  QrCode,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { PACKAGES, PackageSlug } from "../../../lib/packages";
import { TIME_WINDOWS } from "../../../lib/zones";

interface BookingData {
  code: string;
  fullName: string;
  email: string;
  university: string;
  streetAddress: string;
  method: "doorstep" | "campus_hub";
  zoneName: string;
  day: string;
  windowLabel: string;
  arrivalDate: string;
  items: PackageSlug[];
  totalPaid: number;
  deposit: number;
}

function BookingPortalContent() {
  const params = useParams<{ code: string }>();
  const code = params?.code || "PC-2027-DEMO";

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [pickupDate, setPickupDate] = useState("2027-06-25");
  const [pickupWindow, setPickupWindow] = useState(TIME_WINDOWS[0].label);
  const [pickupLocked, setPickupLocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`booking_${code}`);
      if (saved) {
        setBooking(JSON.parse(saved));
        return;
      }
    }
    setBooking({
      code,
      fullName: "Clara Lindqvist",
      email: "clara.lindqvist@student.ephec.be",
      university: "Haute École EPHEC",
      streetAddress: "Rue des Tongres 42, 1040 Brussels",
      method: "doorstep",
      zoneName: "Zone 1 — Etterbeek, Ixelles & Auderghem",
      day: "Monday",
      windowLabel: "10:00 – 12:00",
      arrivalDate: "2027-02-01",
      items: ["kitchen", "bedroom", "bathroom"],
      totalPaid: 184,
      deposit: 35,
    });
  }, [code]);

  const handleAddExtraKit = (slug: PackageSlug) => {
    if (!booking || booking.items.includes(slug)) return;
    const pkg = PACKAGES.find((p) => p.slug === slug);
    if (!pkg) return;

    const updated: BookingData = {
      ...booking,
      items: [...booking.items, slug],
      totalPaid: booking.totalPaid + pkg.priceEur + pkg.depositEur,
      deposit: booking.deposit + pkg.depositEur,
    };
    setBooking(updated);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`booking_${code}`, JSON.stringify(updated));
    }
  };

  if (!booking) return null;

  const missingPackages = PACKAGES.filter((p) => !booking.items.includes(p.slug));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Confirmation Header */}
      <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-emerald-600" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Slot Locked &amp; Confirmed
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                Booking {booking.code}
              </h1>
              <p className="mt-0.5 text-sm text-slate-600">
                Welcome to Brussels, <strong>{booking.fullName}</strong> ({booking.university}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
            <QrCode className="h-5 w-5 text-slate-700" />
            <div>
              <div className="font-bold text-slate-900">QR Bag Tag</div>
              <div className="font-mono text-slate-600">BAG-{booking.code.slice(-4)}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 text-xs sm:grid-cols-3">
          <div>
            <span className="text-slate-500">Delivery Location</span>
            <p className="mt-0.5 font-semibold text-slate-900">{booking.streetAddress}</p>
          </div>
          <div>
            <span className="text-slate-500">Locked 2-Hour Window</span>
            <p className="mt-0.5 font-semibold text-emerald-800">
              {booking.day} ({booking.windowLabel})
            </p>
          </div>
          <div>
            <span className="text-slate-500">Deposit Protected</span>
            <p className="mt-0.5 font-semibold text-slate-900">
              €{booking.deposit.toFixed(2)} refundable
            </p>
          </div>
        </div>
      </div>

      {/* Active Items & 48h Post-Arrival Add-On */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">
            Your Packed Starter Kit
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {booking.items.map((slug) => {
              const pkg = PACKAGES.find((p) => p.slug === slug);
              if (!pkg) return null;
              return (
                <li
                  key={slug}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5"
                >
                  <span className="font-medium text-slate-900">{pkg.name}</span>
                  <span className="text-xs font-semibold text-emerald-700">
                    Sanitized &amp; Ready
                  </span>
                </li>
              );
            })}
          </ul>

          {missingPackages.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <PackagePlus className="h-4 w-4 text-emerald-600" />
                48-Hour Post-Arrival Add-On Window
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Checked your shared flat and need extra gear? Add it with €0 delivery fee:
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {missingPackages.map((pkg) => (
                  <button
                    key={pkg.slug}
                    type="button"
                    onClick={() => handleAddExtraKit(pkg.slug)}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                  >
                    + Add {pkg.name} (€{pkg.priceEur})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* End-of-Semester Pickup Scheduler */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              End-of-Semester Collection
            </h2>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Wipe down kitchenware, pack everything into your foldable padded bag, and lock your 2-hour Urbike pickup window below.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Departure Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => {
                  setPickupDate(e.target.value);
                  setPickupLocked(false);
                }}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                2-Hour Pickup Slot
              </label>
              <select
                value={pickupWindow}
                onChange={(e) => {
                  setPickupWindow(e.target.value);
                  setPickupLocked(false);
                }}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
              >
                {TIME_WINDOWS.map((w) => (
                  <option key={w.id} value={w.label}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setPickupLocked(true)}
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                pickupLocked
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {pickupLocked
                ? `Pickup Locked: ${pickupDate} (${pickupWindow})`
                : "Schedule End-of-Semester Pickup"}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              Deposit (€{booking.deposit.toFixed(2)}) automatically refunded within 48h of QR bag scan.
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
        <Link href="/" className="font-medium text-emerald-700 hover:underline">
          ← Return to Home
        </Link>
        <Link href="/admin" className="font-medium text-slate-600 hover:underline">
          Operations &amp; Courier Dashboard →
        </Link>
      </div>
    </div>
  );
}

export default function BookingPortalPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6">
      <Suspense
        fallback={
          <div className="p-10 text-center text-sm text-slate-500">
            Loading booking details...
          </div>
        }
      >
        <BookingPortalContent />
      </Suspense>
    </main>
  );
}