"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Bike,
  MapPin,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";
import {
  PACKAGES,
  PackageSlug,
  calculateCart,
} from "../lib/packages";
import {
  BRUSSELS_ZONES,
  CAMPUS_HUBS,
  TIME_WINDOWS,
  findZoneByPostcode,
} from "../lib/zones";

export default function KitBuilder() {
  const router = useRouter();
  const [selected, setSelected] = useState<PackageSlug[]>([
    "kitchen",
    "bedroom",
    "bathroom",
  ]);
  const [expandedSlug, setExpandedSlug] = useState<PackageSlug | null>("kitchen");
  const [deliveryMethod, setDeliveryMethod] = useState<"doorstep" | "campus_hub">("doorstep");
  const [postcode, setPostcode] = useState("1040");
  const [selectedHub, setSelectedHub] = useState(CAMPUS_HUBS[0].id);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedWindow, setSelectedWindow] = useState(TIME_WINDOWS[0].id);

  const togglePackage = (slug: PackageSlug) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const selectCompleteBundle = () => {
    setSelected((prev) => {
      const hasCleaning = prev.includes("cleaning");
      return hasCleaning
        ? ["kitchen", "bedroom", "bathroom", "cleaning"]
        : ["kitchen", "bedroom", "bathroom"];
    });
  };

  const cart = calculateCart(selected, deliveryMethod);
  const matchedZone = findZoneByPostcode(postcode);

  const handleContinue = () => {
    if (selected.length === 0) return;
    const params = new URLSearchParams({
      items: selected.join(","),
      method: deliveryMethod,
      postcode: deliveryMethod === "doorstep" ? postcode : "",
      hub: deliveryMethod === "campus_hub" ? selectedHub : "",
      day: selectedDay,
      window: selectedWindow,
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <section id="builder" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Step 1 of 2 — Customize Your Semester Kit
          </span>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Pick only what your Brussels kot is missing
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Select all 3 rental kits to unlock the{" "}
            <strong className="text-emerald-700">€14 Complete Bundle discount</strong> and{" "}
            <strong className="text-emerald-700">€35 capped deposit</strong>.
          </p>
        </div>

        {!cart.isCompleteBundle && (
          <button
            type="button"
            onClick={selectCompleteBundle}
            className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Select Complete Bundle (€149)
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Package Cards */}
        <div className="space-y-4 lg:col-span-7">
          {PACKAGES.map((pkg) => {
            const isSelected = selected.includes(pkg.slug);
            const isExpanded = expandedSlug === pkg.slug;

            return (
              <div
                key={pkg.slug}
                className={`rounded-2xl border bg-white p-5 transition ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-600/15"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => togglePackage(pkg.slug)}
                      aria-label={`Select ${pkg.name}`}
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-4 w-4 stroke-[2.5]" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {pkg.name}
                        </h3>
                        {pkg.badge && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-600">{pkg.tagline}</p>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSlug(isExpanded ? null : pkg.slug)
                        }
                        className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                      >
                        {isExpanded ? (
                          <>
                            Hide exact items ({pkg.items.length})
                            <ChevronUp className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            See exact items inside ({pkg.items.length})
                            <ChevronDown className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900">
                      €{pkg.priceEur}
                    </div>
                    <div className="text-xs text-slate-500">
                      {pkg.isConsumable ? "one-time sale" : "per semester"}
                    </div>
                    <div className="mt-1 text-xs font-medium text-slate-600">
                      {pkg.depositEur > 0
                        ? `+€${pkg.depositEur} deposit`
                        : "€0 deposit"}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <ul className="mt-4 grid gap-1.5 border-t border-slate-100 pt-3.5 text-xs text-slate-700 sm:grid-cols-2">
                    {pkg.items.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <span className="mt-0.5 text-emerald-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Delivery & Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Delivery & Order Summary
            </h3>

            {/* Delivery Method Switch */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setDeliveryMethod("doorstep")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
                  deliveryMethod === "doorstep"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Bike className="h-3.5 w-3.5 text-emerald-600" />
                Urbike Doorstep
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod("campus_hub")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
                  deliveryMethod === "campus_hub"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                Campus Hub (Free)
              </button>
            </div>

            {/* Zone or Hub Selector */}
            {deliveryMethod === "doorstep" ? (
              <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Brussels Postal Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={postcode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPostcode(val);
                      const z = findZoneByPostcode(val);
                      if (z) setSelectedDay(z.deliveryDays[0]);
                    }}
                    placeholder="e.g. 1040, 1050, 1000, 1200"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                {matchedZone ? (
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-emerald-800">
                      {matchedZone.name}
                    </p>
                    <p className="text-slate-600">
                      Near: {matchedZone.campuses}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="block text-[11px] font-medium text-slate-600">
                          Zone Delivery Day
                        </span>
                        <select
                          value={selectedDay}
                          onChange={(e) => setSelectedDay(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900"
                        >
                          {matchedZone.deliveryDays.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="block text-[11px] font-medium text-slate-600">
                          Locked 2h Window
                        </span>
                        <select
                          value={selectedWindow}
                          onChange={(e) => setSelectedWindow(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900"
                        >
                          {TIME_WINDOWS.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-amber-700">
                    Enter a valid Brussels postcode (e.g.,{" "}
                    {BRUSSELS_ZONES.flatMap((z) => z.postcodes).slice(0, 6).join(", ")}
                    ).
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3.5 text-xs">
                <label className="block font-medium text-slate-700">
                  Select Campus Pickup Point
                </label>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900"
                >
                  {CAMPUS_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name} — {hub.hours}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Semester rentals</span>
                <span>€{cart.rentalSubtotal.toFixed(2)}</span>
              </div>

              {cart.consumableSubtotal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Consumables (keep)</span>
                  <span>€{cart.consumableSubtotal.toFixed(2)}</span>
                </div>
              )}

              {cart.isCompleteBundle && (
                <div className="flex justify-between font-medium text-emerald-700">
                  <span>Complete Bundle discount</span>
                  <span>-€{cart.bundleDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  Delivery & end-of-term pickup
                </span>
                <span className={cart.deliveryFee === 0 ? "font-medium text-emerald-700" : ""}>
                  {cart.deliveryFee === 0 ? "FREE" : `€${cart.deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Refundable security deposit</span>
                <span>€{cart.depositTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                <span>Total due today</span>
                <span>€{cart.totalDueToday.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={selected.length === 0 || (deliveryMethod === "doorstep" && !matchedZone)}
              onClick={handleContinue}
              className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {selected.length === 0
                ? "Select at least 1 package"
                : "Continue to Checkout →"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                48h deposit auto-refund
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                48h post-arrival add-on window
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}