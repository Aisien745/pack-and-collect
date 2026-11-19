import { Bike, Recycle, ShieldCheck, Sparkles } from "lucide-react";
import KitBuilder from "../components/KitBuilder";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white">
              P&C
            </span>
            <span className="text-lg font-bold tracking-tight">
              Pack &amp; Collect
            </span>
            <span className="hidden rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 sm:inline-block">
              Brussels Erasmus Edition
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900">
              How it works
            </a>
            <a href="#builder" className="hover:text-slate-900">
              Packages
            </a>
            <a
              href="#builder"
              className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Book for Semester
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
              <Bike className="h-3.5 w-3.5 text-emerald-600" />
              Zero-emission cargo-bike delivery across Brussels
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Rent your Brussels student starter kit. Return it when you fly home.
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Skip dragging duvets on the metro or throwing away pans in June.
              Book thermal-sanitized kitchen, bedroom, and bathroom essentials—delivered
              in a foldable compartmentalized bag during a locked 2-hour window.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#builder"
                className="rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Build Your Kit (From €35/sem)
              </a>
              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                See How Returns Work
              </a>
            </div>
          </div>

          {/* Trust & Logistics Strip */}
          <div className="mt-12 grid gap-4 border-t border-slate-100 pt-8 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  60–90°C Industrial Sanitization
                </h3>
                <p className="mt-0.5 text-xs text-slate-600">
                  Hotel-grade white cotton linens &amp; towels delivered in sealed hygiene bands.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Recycle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Zero Cardboard Waste
                </h3>
                <p className="mt-0.5 text-xs text-slate-600">
                  Delivered in Urbike Euro-crates with a foldable padded bag that fits under your bed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  48-Hour Post-Arrival Flexibility
                </h3>
                <p className="mt-0.5 text-xs text-slate-600">
                  Check what your shared flat already has and add kitchen items within 48h of arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Kit Builder */}
      <KitBuilder />

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">
            How Pack &amp; Collect Works
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <span className="text-xs font-bold uppercase text-emerald-700">
                01. Before Arrival
              </span>
              <h3 className="mt-1 font-semibold text-slate-900">
                Book &amp; Lock a 2-Hour Slot
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Choose your packages online and lock a 2-hour delivery window matched to your Brussels commune—or pick up free at ULB, VUB, or EPHEC.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <span className="text-xs font-bold uppercase text-emerald-700">
                02. During Your Semester
              </span>
              <h3 className="mt-1 font-semibold text-slate-900">
                Unpack &amp; Fold the Bag Flat
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Our courier hands over your padded compartmentalized bag and takes the rigid transport crate back—no bulky boxes cluttering your room.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <span className="text-xs font-bold uppercase text-emerald-700">
                03. End of Semester
              </span>
              <h3 className="mt-1 font-semibold text-slate-900">
                Doorstep Pickup &amp; 48h Refund
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Pack everything back into your foldable bag, hand it to our courier in your chosen pickup window, and get your deposit refunded within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}