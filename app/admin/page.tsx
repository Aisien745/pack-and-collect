"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  PackageCheck,
  QrCode,
  RefreshCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PackageSlug } from "../../lib/packages";

type OrderStatus = "Confirmed" | "Delivered" | "Returned & Refunded";

interface AdminOrder {
  code: string;
  fullName: string;
  university: string;
  streetAddress: string;
  zoneLabel: string;
  slotLabel: string;
  items: PackageSlug[];
  totalPaid: number;
  deposit: number;
  status: OrderStatus;
}

const INITIAL_DEMO_ORDERS: AdminOrder[] = [
  {
    code: "PC-2027-1042",
    fullName: "Lucas Meyer",
    university: "ULB (Solbosch)",
    streetAddress: "Avenue Buyl 88, 1050 Brussels",
    zoneLabel: "Zone 1 — Etterbeek/Ixelles",
    slotLabel: "Monday (10:00 – 12:00)",
    items: ["kitchen", "bedroom", "bathroom", "cleaning"],
    totalPaid: 194,
    deposit: 35,
    status: "Delivered",
  },
  {
    code: "PC-2027-1089",
    fullName: "Sofia Rossi",
    university: "VUB (Etterbeek)",
    streetAddress: "Triomflaan 40, 1050 Brussels",
    zoneLabel: "Zone 1 — Etterbeek/Ixelles",
    slotLabel: "Monday (10:00 – 12:00)",
    items: ["bedroom", "bathroom"],
    totalPaid: 144,
    deposit: 40,
    status: "Confirmed",
  },
  {
    code: "PC-2027-1114",
    fullName: "Mateo Garcia",
    university: "Brik Residence (Center)",
    streetAddress: "Rue Van Orley 15, 1000 Brussels",
    zoneLabel: "Zone 2 — Center/Brik",
    slotLabel: "Tuesday (14:00 – 16:00)",
    items: ["bathroom", "cleaning"],
    totalPaid: 73,
    deposit: 20,
    status: "Confirmed",
  },
  {
    code: "PC-2027-1156",
    fullName: "Emma Nielsen",
    university: "Haute École EPHEC",
    streetAddress: "Avenue Konrad Adenauer 3, 1200 Brussels",
    zoneLabel: "Zone 3 — Woluwe/EPHEC",
    slotLabel: "Wednesday (16:00 – 18:00)",
    items: ["kitchen", "bedroom", "bathroom"],
    totalPaid: 184,
    deposit: 35,
    status: "Returned & Refunded",
  },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_DEMO_ORDERS);
  const [zoneFilter, setZoneFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load any bookings created during this browser session (e.g. PC-2027-6055)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sessionOrders: AdminOrder[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith("booking_")) {
        try {
          const parsed = JSON.parse(sessionStorage.getItem(key) || "{}");
          if (parsed.code) {
            sessionOrders.push({
              code: parsed.code,
              fullName: parsed.fullName || "Student",
              university: parsed.university || "Brussels University",
              streetAddress: parsed.streetAddress || "1040 Brussels",
              zoneLabel: parsed.zoneName
                ? parsed.zoneName.split("—")[0].trim()
                : "Zone 1 — Etterbeek/Ixelles",
              slotLabel: `${parsed.day || "Monday"} (${parsed.windowLabel || "10:00 – 12:00"})`,
              items: parsed.items || ["kitchen", "bedroom", "bathroom"],
              totalPaid: parsed.totalPaid || 184,
              deposit: parsed.deposit || 35,
              status: "Confirmed",
            });
          }
        } catch {
          // Ignore malformed entries
        }
      }
    }

    if (sessionOrders.length > 0) {
      setOrders((prev) => {
        const existingCodes = new Set(prev.map((o) => o.code));
        const uniqueNew = sessionOrders.filter((o) => !existingCodes.has(o.code));
        return [...uniqueNew, ...prev];
      });
    }
  }, []);

  const updateOrderStatus = (code: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.code === code ? { ...order, status: nextStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesZone =
      zoneFilter === "ALL" || order.zoneLabel.startsWith(zoneFilter);
    const matchesSearch =
      order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.streetAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  // Live operational KPIs
  const activeDepositsHeld = orders
    .filter((o) => o.status !== "Returned & Refunded")
    .reduce((sum, o) => sum + o.deposit, 0);

  const pendingDeliveries = orders.filter((o) => o.status === "Confirmed").length;
  const activeInField = orders.filter((o) => o.status === "Delivered").length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Student Storefront
            </Link>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Operations &amp; Urbike Courier Dashboard
            </h1>
            <p className="text-xs text-slate-600">
              Manage locked 2-hour delivery slots, QR bag tags, and 48h deposit auto-refunds.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-900">
            <Bike className="h-4 w-4 text-emerald-600" />
            <span>Urbike Cargo-Bike Partner: Active (15 kits/slot cap)</span>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-medium text-slate-500">
              Ready for Urbike Dispatch
            </span>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {pendingDeliveries} orders
            </div>
            <span className="text-[11px] text-emerald-700">
              Packed in foldable divider bags
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-medium text-slate-500">
              Active Kits in Brussels Kots
            </span>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {164 + activeInField} / 200
            </div>
            <span className="text-[11px] text-slate-500">
              82.5% Autumn fleet utilization
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-medium text-slate-500">
              Deposits Held in Escrow
            </span>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              €{activeDepositsHeld.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500">
              Auto-released within 48h of scan
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-medium text-slate-500">
              Zone 1 Mon 10:00–12:00 Cap
            </span>
            <div className="mt-1 text-2xl font-bold text-emerald-700">
              13 / 15 spots
            </div>
            <span className="text-[11px] text-slate-500">
              2 slots left before auto-lock
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {["ALL", "Zone 1", "Zone 2", "Zone 3"].map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => setZoneFilter(zone)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  zoneFilter === zone
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {zone === "ALL" ? "All Brussels Zones" : zone}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search booking code or student..."
              className="w-full rounded-lg border border-slate-300 py-1.5 pl-8 pr-3 text-xs focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Bookings & QR Operations Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase text-slate-600">
                <tr>
                  <th className="px-4 py-3">Booking &amp; QR Tag</th>
                  <th className="px-4 py-3">Student &amp; Address</th>
                  <th className="px-4 py-3">Locked Urbike Window</th>
                  <th className="px-4 py-3">Packages</th>
                  <th className="px-4 py-3">Deposit</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Courier / Hub Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.code} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{order.code}</div>
                      <div className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">
                        <QrCode className="h-3 w-3" />
                        BAG-{order.code.slice(-4)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">
                        {order.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.university} • {order.streetAddress}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900">
                        {order.zoneLabel}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-700">
                        {order.slotLabel}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {order.items.map((item) => (
                          <span
                            key={item}
                            className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      €{order.deposit.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          order.status === "Confirmed"
                            ? "bg-amber-50 text-amber-800"
                            : order.status === "Delivered"
                            ? "bg-blue-50 text-blue-800"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        {order.status === "Returned & Refunded" && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {order.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {order.status === "Confirmed" && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.code, "Delivered")}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
                        >
                          <PackageCheck className="h-3.5 w-3.5" />
                          Mark Delivered
                        </button>
                      )}

                      {order.status === "Delivered" && (
                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(order.code, "Returned & Refunded")
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700"
                        >
                          <RefreshCcw className="h-3.5 w-3.5" />
                          Scan Return &amp; Refund €{order.deposit}
                        </button>
                      )}

                      {order.status === "Returned & Refunded" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          Refunded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}