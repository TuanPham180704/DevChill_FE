import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';
import { Crown, Shield, Star, Download, MessageCircle, Calendar, CheckCircle2, Clock } from 'lucide-react';
import Sidebar from '../../../components/Client/SideBar';

// Mock subscriptions — replace with real API call later
const MOCK_SUBSCRIPTIONS = [];

const STATUS_STYLES = {
  active: {
    label: 'Đang hoạt động',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.3)',
    color: '#10B981',
    icon: CheckCircle2,
  },
  expired: {
    label: 'Hết hạn',
    bg: 'rgba(100,116,139,0.1)',
    border: 'rgba(100,116,139,0.2)',
    color: '#64748B',
    icon: Clock,
  },
};

export default function PremiumHistory() {
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch — replace with real API call
    const timer = setTimeout(() => {
      setSubscriptions(MOCK_SUBSCRIPTIONS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0E17' }}>
      <Sidebar active="my-premium" />

      <main
        className="flex-1 px-10 py-12 overflow-y-auto"
        style={{ background: '#111827', maxHeight: '100vh' }}
      >
        {/* ── Header ── */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold mb-1">Gói đã mua</h1>
            <p className="text-sm" style={{ color: '#94A3B8' }}>
              Quản lý các tư cách thành viên và lịch sử giao dịch của bạn
            </p>
          </div>
          <Link
            to="/upgrade"
            className="btn-cinematic px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Crown size={14} /> Nâng cấp gói
          </Link>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && subscriptions.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl"
            style={{
              background: 'rgba(15,23,42,0.3)',
              border: '1px dashed rgba(100,116,139,0.2)',
              borderRadius: '16px',
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative overflow-hidden"
              style={{
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(100,116,139,0.3)',
              }}
            >
              <div
                className="absolute inset-0 blur-xl"
                style={{ background: 'rgba(0,242,255,0.05)' }}
              />
              <FaCrown className="text-4xl" style={{ color: '#334155' }} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Chưa có gói Premium nào
            </h3>
            <p className="max-w-sm mb-8 leading-relaxed" style={{ color: '#94A3B8' }}>
              Bạn chưa đăng ký gói Premium nào. Hãy nâng cấp để trải nghiệm
              không giới hạn kho phim bom tấn với chất lượng 4K sắc nét!
            </p>

            <Link
              to="/upgrade"
              className="btn-cinematic px-8 py-3.5 rounded-xl text-base flex items-center gap-2"
              style={{
                boxShadow: '0 0 20px rgba(0,242,255,0.15)',
              }}
            >
              <FaCrown /> Khám phá gói Premium
            </Link>
          </div>
        )}

        {/* ── Subscription list ── */}
        {!loading && subscriptions.length > 0 && (
          <div className="space-y-4">
            {subscriptions.map((sub) => {
              const statusStyle = STATUS_STYLES[sub.status] ?? STATUS_STYLES.expired;
              const StatusIcon = statusStyle.icon;

              return (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl flex items-center gap-5"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${sub.color ?? '#00D4FF'}20`,
                      border: `1px solid ${sub.color ?? '#00D4FF'}40`,
                    }}
                  >
                    <Crown size={20} style={{ color: sub.color ?? '#00D4FF' }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-bold truncate">{sub.name}</p>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
                        style={{
                          background: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          color: statusStyle.color,
                        }}
                      >
                        <StatusIcon size={11} />
                        {statusStyle.label}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-4 text-xs"
                      style={{ color: '#64748B' }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> Mua: {sub.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Hết hạn: {sub.endDate}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="font-black text-lg" style={{ color: sub.color ?? '#00D4FF' }}>
                      {sub.price?.toLocaleString('vi-VN')} ₫
                    </p>
                    <p className="text-xs" style={{ color: '#374151' }}>
                      /{sub.duration === 12 ? 'năm' : 'tháng'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        main::-webkit-scrollbar { display: none; }
        main { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
