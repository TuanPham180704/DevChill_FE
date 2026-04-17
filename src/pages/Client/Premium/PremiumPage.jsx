/* eslint-disable no-unused-vars */

import { useState } from "react";
import { Crown, Shield, Star, Download, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PackageCard from "../../../components/Client/Premium/PackageCard";
import { PACKAGES } from "../../../data/packages";

const FEATURES = [
  { icon: Shield, label: "Không quảng cáo", desc: "Xem phim liền mạch" },
  { icon: Star, label: "4K Ultra HD", desc: "Chất lượng cao nhất" },
  { icon: Download, label: "Tải offline", desc: "Xem không cần internet" },
  { icon: MessageCircle, label: "Chat VIP", desc: "Tương tác realtime" },
];

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const visiblePackages = PACKAGES.filter((p) => p.id !== "p1");

  return (
    <div
      className="min-h-screen py-10 px-4 md:px-8"
      style={{ background: "#F8FAFC" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.4)",
            }}
          >
            <Crown size={14} style={{ color: "#D97706" }} />
            <span
              className="text-sm font-black tracking-widest"
              style={{ color: "#D97706" }}
            >
              PREMIUM PLANS
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #0F172A 0%, #475569 100%)",
            }}
          >
            Nâng cấp trải nghiệm
          </h1>
          <p className="text-[17px]" style={{ color: "#64748B" }}>
            Xem phim không giới hạn, không quảng cáo với chất lượng 4K
          </p>

          {/* Billing cycle toggle */}
          <div
            className="inline-flex items-center mt-6 p-1 rounded-xl"
            style={{
              background: "#F1F5F9",
              border: "1px solid #E2E8F0",
            }}
          >
            {["monthly", "yearly"].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className="px-6 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background:
                    billingCycle === cycle ? "#0EA5E9" : "transparent",
                  color: billingCycle === cycle ? "#fff" : "#64748B",
                }}
              >
                {cycle === "monthly" ? "Hàng tháng" : "Hàng năm"}
                {cycle === "yearly" && (
                  <span
                    className="ml-1.5 px-1.5 py-0.5 rounded text-xs"
                    style={{ background: "#10B981", color: "#fff" }}
                  >
                    -28%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {visiblePackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} billingCycle={billingCycle} />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="p-4 rounded-2xl text-center"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: "#EFF6FF" }}
              >
                <Icon size={18} style={{ color: "#0EA5E9" }} />
              </div>
              <p
                className="font-bold text-sm mb-1"
                style={{ color: "#0F172A" }}
              >
                {label}
              </p>
              <p className="text-xs" style={{ color: "#64748B" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm" style={{ color: "#475569" }}>
            Đã có gói Premium?{" "}
            <Link
              to="/my-premium"
              className="font-semibold underline transition-colors hover:opacity-80"
              style={{ color: "#0EA5E9" }}
            >
              Xem lịch sử gói của bạn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
