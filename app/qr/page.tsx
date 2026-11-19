"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, ExternalLink, Copy, Check, ArrowLeft } from "lucide-react";

const DEFAULT_LIVE_URL = "https://pack-and-collect.vercel.app";

export default function QrCodePage() {
  const [targetUrl, setTargetUrl] = useState(DEFAULT_LIVE_URL);
  const [qrPngUrl, setQrPngUrl] = useState<string>("");
  const [qrSvgString, setQrSvgString] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Auto-detect live Vercel domain if opened on production
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost")
    ) {
      setTargetUrl(window.location.origin);
    }
  }, []);

  // Generate high-res PNG & vector SVG whenever targetUrl changes
  useEffect(() => {
    const cleanUrl = targetUrl.trim() || DEFAULT_LIVE_URL;

    QRCode.toDataURL(cleanUrl, {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#1B5E3A",
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => setQrPngUrl(dataUrl))
      .catch((err) => console.error("QR PNG generation failed:", err));

    QRCode.toString(cleanUrl, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#1B5E3A",
        light: "#FFFFFF",
      },
    })
      .then((svg) => setQrSvgString(svg))
      .catch((err) => console.error("QR SVG generation failed:", err));
  }, [targetUrl]);

  const downloadPng = () => {
    if (!qrPngUrl) return;
    const link = document.createElement("a");
    link.href = qrPngUrl;
    link.download = "pack-and-collect-qr.png";
    link.click();
  };

  const downloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pack-and-collect-qr.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#FAFBF9] px-4 py-10 text-[#182B22]">
      <div className="mx-auto max-w-lg">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B5E3A] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Storefront
        </a>

        <div className="mt-4 rounded-2xl border border-[#CBE0D6] bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#E8F2EE] px-3 py-1 text-xs font-bold text-[#1B5E3A]">
              Scan to Book
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
              Pack &amp; Collect QR Code
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Point your phone camera at the code below to test opening the website.
            </p>
          </div>

          {/* QR Code Card */}
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-slate-200 bg-[#F4F9F6] p-6">
            {qrPngUrl ? (
              <div className="rounded-xl bg-white p-4 shadow-xs">
                <img
                  src={qrPngUrl}
                  alt="Pack & Collect Website QR Code"
                  className="h-60 w-60 object-contain"
                />
              </div>
            ) : (
              <div className="flex h-60 w-60 items-center justify-center text-sm text-slate-400">
                Generating QR...
              </div>
            )}
            <p className="mt-3 text-xs font-semibold text-[#1B5E3A]">
              Rent or buy your student essentials in Brussels
            </p>
          </div>

          {/* Editable Destination URL */}
          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
              Destination Website URL
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://pack-and-collect.vercel.app"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#1B5E3A] focus:outline-none"
              />
              <button
                type="button"
                onClick={copyLink}
                title="Copy URL"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#1B5E3A]" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Tip: You can add campaign tags like{" "}
              <code className="rounded bg-slate-100 px-1">?ref=ephec</code> to track flyer scans.
            </p>
          </div>

          {/* Download Buttons */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={downloadPng}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1B5E3A] px-4 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#15492D]"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>

            <button
              type="button"
              onClick={downloadSvg}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#1B5E3A] bg-white px-4 py-3 text-sm font-semibold text-[#1B5E3A] transition hover:bg-[#E8F2EE]"
            >
              <Download className="h-4 w-4" />
              Download SVG (Print)
            </button>
          </div>

          <div className="mt-4 text-center">
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1B5E3A]"
            >
              Test destination link in new tab
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}