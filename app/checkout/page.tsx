"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bike,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import {
  PACKAGES,
  PackageSlug,
  calculateCart,
} from "../../lib/packages";
import {
  CAMPUS_HUBS,
  TIME_WINDOWS,
  findZoneByPostcode,
} from "../../lib/zones";

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read selections passed from KitBuilder
  const rawItems = searchParams.get("items") || "kitchen,bedroom,bathroom";
  const selectedSlugs = rawItems
    .split(",")
    .filter((s): s is PackageSlug =>
      ["kitchen", "bedroom", "bathroom", "cleaning"].includes(s)
    );

  const method =
    searchParams.get("method") === "campus_hub" ? "campus_hub" : "doorstep";
  const postcode = searchParams.get("postcode") || "1040";
  const hubId = searchParams.get("hub") || CAMPUS_HUBS[0].id;
  const day = searchParams.get("day") || "Monday";
  const windowId = searchParams.get("window") || TIME_WINDOWS[0].id;

  const cart = calculateCart(selectedSlugs, method);
  const selectedPackages = PACKAGES.filter((p) =>
    selectedSlugs.includes(p.slug)
  );
  const zone = findZoneByPostcode(postcode);
  const hub = CAMPUS_HUBS.find((h) => h.id === hubId) || CAMPUS_HUBS[0];
  const timeWindow =
    TIME_WINDOWS.find((w) => w.id === windowId) || TIME_WINDOWS[0];

  // Student form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("Haute École EPHEC");
  const [streetAddress, setStreetAddress] = useState("");
  const [arrivalDate, setArrivalDate] = useState("2027-02-01");
  const [paymentTiming, setPaymentTiming] = useState<"upfront" | "two_parts">(
    "upfront"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Instant autofill for professor demo
  const fillDemoStudent = () => {
    setFullName("Clara Lindqvist");
    setEmail("clara.lindqvist@student.ephec.be");
    setUniversity("Haute École EPHEC");
    setStreetAddress("Rue des Tongres 42, Apt 3B");
    setArrivalDate("2027-02-01");
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate unique booking code e.g. PC-2027-4821
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `PC-2027-${randomNum}`;

    const bookingPayload = {
      code: bookingCode,
      fullName,
      email,
      university,
      streetAddress: method === "doorstep" ? `${streetAddress}, ${postcode} Brussels` : hub.name,
      method,
      zoneName: zone?.name || "Brussels Campus Hub",
      day,
      windowLabel: timeWindow.label,
      arrivalDate,
      items: selectedSlugs,
      totalPaid: cart.totalDueToday,
      deposit: cart.depositTotal,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem(`booking_${bookingCode}`, JSON.stringify(bookingPayload));
    }

    router.push(`/booking/${bookingCode}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/#builder"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Kit Builder
        </Link>

        <button
          type="button"
          onClick={fillDemoStudent}
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 transition hover:bg-amber-100"
        >
          <UserCheck className="h-3.5 w-3.5" />
          Fill Demo Student (Presentation Mode)
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Student & Delivery Details Form */}
        <form
          onSubmit={handleConfirmBooking}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Step 2 of 2 — Lock Your Delivery Slot
            </span>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Student &amp; Kot Details
            </h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Clara Lindqvist"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Student Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@student.university.be"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Host University in Brussels
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              >
                <option>Haute École EPHEC</option>
                <option>ULB (Université libre de Bruxelles)</option>
                <option>VUB (Vrije Universiteit Brussel)</option>
                <option>KU Leuven (Brussels Campus)</option>
                <option>UCLouvain (Woluwe / Saint-Louis)</option>
                <option>Other / Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Brussels Arrival Date *
              </label>
              <input
                type="date"
                required
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {method === "doorstep" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Brussels Street Address &amp; Room/Floor *
              </label>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="e.g. Avenue de la Couronne 120, Kot 4"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                Bpost cargo-bike courier hands over your padded bag at the entrance and takes the rigid transport crate back.
              </p>
            </div>
          )}

          {/* Payment Preference (Aligned with Survey Findings) */}
          <div className="border-t border-slate-100 pt-4">
            <label className="block text-xs font-semibold text-slate-700">
              Payment Option
            </label>
            <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentTiming("upfront")}
                className={`rounded-xl border p-3 text-left transition ${
                  paymentTiming === "upfront"
                    ? "border-emerald-600 bg-emerald-50/50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-slate-900">
                  Single Upfront Payment
                </div>
                <div className="mt-0.5 text-[11px] text-slate-600">
                  Pay €{cart.totalDueToday.toFixed(2)} once (incl. refundable deposit)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTiming("two_parts")}
                className={`rounded-xl border p-3 text-left transition ${
                  paymentTiming === "two_parts"
                    ? "border-emerald-600 bg-emerald-50/50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-slate-900">
                  2 Instalments (50% / 50%)
                </div>
                <div className="mt-0.5 text-[11px] text-slate-600">
                  €{(cart.totalDueToday / 2).toFixed(2)} today + €
                  {(cart.totalDueToday / 2).toFixed(2)} at delivery
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Lock className="h-4 w-4" />
            {isSubmitting
              ? "Locking Your Bpost Slot..."
              : `Confirm Booking & Lock Slot (€${
                  paymentTiming === "upfront"
                    ? cart.totalDueToday.toFixed(2)
                    : (cart.totalDueToday / 2).toFixed(2)
                })`}
          </button>
        </form>

        {/* Right: Locked Slot & Summary Card */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Reserved Logistics Slot
              </h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                12 / 15 spots left
              </span>
            </div>

            <div className="mt-3 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700">
              {method === "doorstep" ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Bike className="h-4 w-4 text-emerald-600" />
                    Bpost Doorstep Delivery ({postcode})
                  </div>
                  <p>{zone?.name}</p>
                  <p className="font-medium text-emerald-800">
                    Window: {day}, {timeWindow.label}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    Campus Hub Pickup (Free)
                  </div>
                  <p>{hub.name}</p>
                  <p className="text-slate-500">{hub.hours}</p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs">
              {selectedPackages.map((pkg) => (
                <div key={pkg.slug} className="flex justify-between text-slate-700">
                  <span>{pkg.name}</span>
                  <span className="font-medium">€{pkg.priceEur.toFixed(2)}</span>
                </div>
              ))}

              {cart.isCompleteBundle && (
                <div className="flex justify-between font-semibold text-emerald-700">
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Complete Bundle Savings
                  </span>
                  <span>-€{cart.bundleDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery &amp; semester-end collection</span>
                <span className="font-medium text-emerald-700">
                  {cart.deliveryFee === 0 ? "FREE" : `€${cart.deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Refundable security deposit</span>
                <span>€{cart.depositTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
                <span>Total</span>
                <span>€{cart.totalDueToday.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50/70 p-2.5 text-[11px] text-emerald-900">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Your €{cart.depositTotal} deposit is automatically refunded within 48 hours of end-of-semester return.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense fallback={<div className="p-10 text-center text-sm text-slate-500">Loading checkout...</div>}>
        <CheckoutForm />
      </Suspense>
    </main>
  );
}