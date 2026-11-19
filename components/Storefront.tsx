"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Utensils,
  BedDouble,
  Bath,
  Sparkles,
  Gift,
  Laptop,
  CreditCard,
  Truck,
  CalendarDays,
  RefreshCw,
  ArrowRight,
  Check,
  X,
  Bike,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PACKAGES, PackageSlug, calculateCart } from "../lib/packages";
import {
  BRUSSELS_ZONES,
  CAMPUS_HUBS,
  TIME_WINDOWS,
  findZoneByPostcode,
} from "../lib/zones";
import {
  BrusselsSkyline,
  BundleBoxIllustration,
} from "./BrandIllustrations";

export default function Storefront() {
  const router = useRouter();
  const [selected, setSelected] = useState<PackageSlug[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [expandedItemsSlug, setExpandedItemsSlug] = useState<PackageSlug | null>(null);

  // Delivery state inside drawer
  const [deliveryMethod, setDeliveryMethod] = useState<"doorstep" | "campus_hub">("doorstep");
  const [postcode, setPostcode] = useState("1040");
  const [selectedHub, setSelectedHub] = useState(CAMPUS_HUBS[0].id);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedWindow, setSelectedWindow] = useState(TIME_WINDOWS[0].id);

  const togglePackage = (slug: PackageSlug) => {
    setSelected((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      return next;
    });
  };

  const selectCompleteBundle = () => {
    setSelected(["kitchen", "bedroom", "bathroom", "cleaning"]);
    setCartOpen(true);
  };

  const cart = calculateCart(selected, deliveryMethod);
  const matchedZone = findZoneByPostcode(postcode);

  const getPackageIcon = (slug: PackageSlug) => {
    switch (slug) {
      case "kitchen":
        return <Utensils className="h-5 w-5 text-[#1B5E3A]" />;
      case "bedroom":
        return <BedDouble className="h-5 w-5 text-[#1B5E3A]" />;
      case "bathroom":
        return <Bath className="h-5 w-5 text-[#1B5E3A]" />;
      case "cleaning":
        return <Sparkles className="h-5 w-5 text-[#1B5E3A]" />;
    }
  };

  const handleCheckout = () => {
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
    <div className="min-h-screen bg-[#FAFBF9] text-[#1E2923]">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
{/* Logo */}
<a href="#" className="flex items-center">
            <img
              src="/logo.png"
              alt="Pack & Collect"
              className="h-16 w-auto object-contain"
            />
          </a>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a
              href="#packages"
              className="border-b-2 border-[#1B5E3A] pb-1 font-semibold text-[#1B5E3A]"
            >
              Our Packages
            </a>
            <a href="#how-it-works" className="transition hover:text-[#1B5E3A]">
              How It Works
            </a>
            <a href="#about" className="transition hover:text-[#1B5E3A]">
              About Us
            </a>
            <a href="#faq" className="transition hover:text-[#1B5E3A]">
              FAQ
            </a>
          </nav>

          {/* Right Cart + Order Now CTA */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping cart"
              className="relative rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1B5E3A] text-[11px] font-bold text-white">
                {selected.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selected.length === 0) {
                  document
                    .getElementById("packages")
                    ?.scrollIntoView({ behavior: "smooth" });
                } else {
                  setCartOpen(true);
                }
              }}
              className="rounded-lg bg-[#1B5E3A] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15492D]"
            >
              Order Now
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER WITH BRUSSELS SKYLINE */}
      <section className="border-b border-[#D5E6DD] bg-[#E8F2EE]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 pt-8 pb-6 sm:px-6 lg:flex-row lg:pb-0">
          <div className="max-w-xl pb-4 lg:pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#182B22] sm:text-4xl">
              Rent or buy your essentials for your stay in Brussels
            </h1>
            <p className="mt-2.5 text-base font-medium text-[#3B5247]">
              Practical, affordable and sustainable solutions for Erasmus and international students.
            </p>
          </div>

          <div className="w-full max-w-md shrink-0 lg:max-w-[440px]">
            <BrusselsSkyline className="h-auto w-full" />
          </div>
        </div>
      </section>

      {/* 3. OUR PACKAGES (4-COLUMN GRID) */}
      <section id="packages" className="mx-auto max-w-6xl px-4 pt-10 pb-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#182B22]">
            Our Packages
          </h2>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="text-sm font-semibold text-[#1B5E3A] underline underline-offset-4 hover:text-[#15492D]"
            >
              View selected kit ({selected.length}) →
            </button>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg) => {
            const isSelected = selected.includes(pkg.slug);
            const isExpanded = expandedItemsSlug === pkg.slug;

            return (
              <div
                key={pkg.slug}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                  isSelected
                    ? "border-[#1B5E3A] ring-2 ring-[#1B5E3A]/20"
                    : "border-slate-200/90 hover:shadow-md"
                }`}
              >
                {/* Top Product Photo */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="h-full w-full object-cover"
                  />
                  {isSelected && (
                    <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-[#1B5E3A] px-2.5 py-1 text-[11px] font-bold text-white shadow">
                      <Check className="h-3 w-3" /> Selected
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getPackageIcon(pkg.slug)}
                    <h3 className="text-base font-bold text-[#182B22]">
                      {pkg.name}
                    </h3>
                  </div>

                  <p className="mt-1.5 min-h-[36px] text-xs leading-relaxed text-slate-600">
                    {pkg.tagline}
                  </p>

                  {/* Category Pill */}
                  <div className="mt-3 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#F1F5F3] px-3 py-1 text-[11px] font-medium text-slate-700">
                      {pkg.categoryLabel}
                    </span>
                  </div>

                  {/* Expandable Item List */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedItemsSlug(isExpanded ? null : pkg.slug)
                    }
                    className="mt-2 inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-[#1B5E3A] hover:underline"
                  >
                    {isExpanded ? (
                      <>
                        Hide items <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        See {pkg.items.length} items inside{" "}
                        <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>

                  {isExpanded && (
                    <ul className="mt-2.5 space-y-1 rounded-lg bg-slate-50 p-2.5 text-left text-[11px] text-slate-700">
                      {pkg.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  )}

                  {/* Price & Deposit */}
                  <div className="mt-auto pt-4">
                    <div className="text-lg font-extrabold text-[#182B22]">
                      €{pkg.priceEur.toFixed(2)}{" "}
                      <span className="text-xs font-semibold text-slate-600">
                        {pkg.isConsumable ? "(one-time sale)" : "/ semester"}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {pkg.depositEur > 0
                        ? `+ €${pkg.depositEur.toFixed(2)} refundable deposit`
                        : "No deposit"}
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePackage(pkg.slug)}
                      className={`mt-3.5 w-full rounded-lg py-2.5 text-xs font-semibold transition ${
                        isSelected
                          ? "bg-[#E8F2EE] text-[#1B5E3A] ring-1 ring-[#1B5E3A]"
                          : "bg-[#1B5E3A] text-white hover:bg-[#15492D]"
                      }`}
                    >
                      {isSelected ? "Selected ✓ (Remove)" : "Select package"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COMPLETE BUNDLE HORIZONTAL CARD */}
      <section className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-[#CBE0D6] bg-[#E8F2EE] px-6 py-4 lg:flex-row">
          {/* Left Box Illustration */}
          <div className="shrink-0">
            <BundleBoxIllustration className="h-24 w-44" />
          </div>

          {/* Center Title & Description */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 lg:justify-start">
              <Gift className="h-6 w-6 text-[#1B5E3A]" />
              <h3 className="text-xl font-extrabold text-[#182B22]">
                Complete Bundle
              </h3>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-700 sm:text-sm">
              The all-in-one solution: Kitchen + Bedroom + Bathroom + Cleaning packages.
            </p>
          </div>

          {/* Price + Savings Pill */}
          <div className="text-center">
            <div className="text-2xl font-extrabold text-[#182B22]">€149.00</div>
            <span className="mt-1 inline-block rounded-md bg-[#D1E7DD] px-2.5 py-0.5 text-xs font-semibold text-[#1B5E3A]">
              Save €14 vs. separate packages
            </span>
          </div>

          {/* Select Bundle CTA */}
          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={selectCompleteBundle}
              className="w-full rounded-lg bg-[#1B5E3A] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15492D] sm:w-auto"
            >
              Select bundle
            </button>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS? (5-STEP HORIZONTAL FLOW) */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#CBE0D6] bg-[#E8F2EE] px-6 py-5 lg:flex-row">
          <h2 className="shrink-0 text-xl font-extrabold text-[#182B22]">
            How it works?
          </h2>

          <div className="grid flex-1 grid-cols-2 items-center gap-4 sm:grid-cols-5">
            {[
              {
                icon: <Laptop className="h-6 w-6 text-[#1B5E3A]" />,
                label: "1. Choose your package(s)",
              },
              {
                icon: <CreditCard className="h-6 w-6 text-[#1B5E3A]" />,
                label: "2. Place your order",
              },
              {
                icon: <Truck className="h-6 w-6 text-[#1B5E3A]" />,
                label: "3. Receive your package(s)",
              },
              {
                icon: <CalendarDays className="h-6 w-6 text-[#1B5E3A]" />,
                label: "4. Use it during your stay (4–6 months)",
              },
              {
                icon: <RefreshCw className="h-6 w-6 text-[#1B5E3A]" />,
                label: "5. We collect it (at the end of your stay)",
              },
            ].map((step, idx, arr) => (
              <div key={step.label} className="relative flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-xs">
                    {step.icon}
                  </div>
                  <span className="max-w-[125px] text-[11px] font-semibold leading-snug text-[#1E2923]">
                    {step.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-[#1B5E3A]/60 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ABOUT US & FAQ (LIGHTWEIGHT FOOTER SECTIONS) */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-bold text-[#182B22]">About Pack &amp; Collect</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Founded by students in Brussels, Pack &amp; Collect eliminates the cost and waste of buying brand-new kitchenware, bedding, and towels for a 5-month exchange. All textiles undergo 60–90°C industrial thermal sanitization, and deliveries run via zero-emission cargo bikes in reusable padded bags.
            </p>
          </div>

          <div id="faq" className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-bold text-[#182B22]">Frequently Asked Questions</h3>
            <div className="mt-2 space-y-2 text-xs text-slate-600">
              <p>
                <strong className="text-slate-900">When is my deposit refunded?</strong>{" "}
                Within 48 hours after our courier scans your returned bag at the end of your semester.
              </p>
              <p>
                <strong className="text-slate-900">What if my kot already has pots or plates?</strong>{" "}
                You have a 48-hour post-arrival window to add or adjust items once you inspect your shared kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SLIDE-OVER CART & BRUSSELS ZONE DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-[#182B22]">
                Your Starter Kit ({selected.length})
              </h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
              {selected.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  Your cart is empty. Select a package or the Complete Bundle to get started.
                </p>
              ) : (
                <>
                  {/* Selected Items */}
                  <div className="space-y-2">
                    {PACKAGES.filter((p) => selected.includes(p.slug)).map((pkg) => (
                      <div
                        key={pkg.slug}
                        className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{pkg.name}</div>
                          <div className="text-slate-500">
                            €{pkg.priceEur.toFixed(2)} + €{pkg.depositEur.toFixed(2)} deposit
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => togglePackage(pkg.slug)}
                          className="font-semibold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Method Toggle */}
                  <div className="rounded-xl bg-[#F4F8F6] p-3.5">
                    <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-white p-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("doorstep")}
                        className={`flex items-center justify-center gap-1 rounded-md py-1.5 font-semibold ${
                          deliveryMethod === "doorstep"
                            ? "bg-[#1B5E3A] text-white"
                            : "text-slate-600"
                        }`}
                      >
                        <Bike className="h-3.5 w-3.5" />
                        Urbike Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("campus_hub")}
                        className={`flex items-center justify-center gap-1 rounded-md py-1.5 font-semibold ${
                          deliveryMethod === "campus_hub"
                            ? "bg-[#1B5E3A] text-white"
                            : "text-slate-600"
                        }`}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        Campus Hub
                      </button>
                    </div>

                    {deliveryMethod === "doorstep" ? (
                      <div className="mt-3 space-y-2 text-xs">
                        <label className="block font-semibold text-slate-700">
                          Brussels Postal Code
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={postcode}
                          onChange={(e) => {
                            setPostcode(e.target.value);
                            const z = findZoneByPostcode(e.target.value);
                            if (z) setSelectedDay(z.deliveryDays[0]);
                          }}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
                        />
                        {matchedZone ? (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <select
                              value={selectedDay}
                              onChange={(e) => setSelectedDay(e.target.value)}
                              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
                            >
                              {matchedZone.deliveryDays.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                            <select
                              value={selectedWindow}
                              onChange={(e) => setSelectedWindow(e.target.value)}
                              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
                            >
                              {TIME_WINDOWS.map((w) => (
                                <option key={w.id} value={w.id}>
                                  {w.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <p className="text-amber-700">
                            Enter a Brussels postcode (e.g. 1040, 1050, 1000, 1200).
                          </p>
                        )}
                      </div>
                    ) : (
                      <select
                        value={selectedHub}
                        onChange={(e) => setSelectedHub(e.target.value)}
                        className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs"
                      >
                        {CAMPUS_HUBS.map((hub) => (
                          <option key={hub.id} value={hub.id}>
                            {hub.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer Totals */}
            {selected.length > 0 && (
              <div className="border-t border-slate-200 pt-4 text-xs">
                {cart.isCompleteBundle && (
                  <div className="mb-1.5 flex justify-between font-semibold text-[#1B5E3A]">
                    <span>Complete Bundle discount</span>
                    <span>-€{cart.bundleDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery &amp; end-of-stay collection</span>
                  <span className="font-semibold text-[#1B5E3A]">
                    {cart.deliveryFee === 0 ? "FREE" : `€${cart.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-slate-600">
                  <span>Refundable security deposit</span>
                  <span>€{cart.depositTotal.toFixed(2)}</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-slate-100 pt-2.5 text-base font-extrabold text-[#182B22]">
                  <span>Total due today</span>
                  <span>€{cart.totalDueToday.toFixed(2)}</span>
                </div>

                <button
                  type="button"
                  disabled={deliveryMethod === "doorstep" && !matchedZone}
                  onClick={handleCheckout}
                  className="mt-4 w-full rounded-xl bg-[#1B5E3A] py-3 text-sm font-semibold text-white transition hover:bg-[#15492D] disabled:bg-slate-300"
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}