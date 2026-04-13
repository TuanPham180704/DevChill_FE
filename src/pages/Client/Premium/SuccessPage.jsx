import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Crown, ChevronRight, Shield, Star, Download, MessageCircle } from 'lucide-react';
import { getPackageById } from '../../../data/packages';

const UNLOCKED = [
  { icon: Shield, label: 'Không quảng cáo' },
  { icon: Star,   label: '4K Ultra HD'     },
  { icon: Download, label: 'Tải offline'   },
  { icon: MessageCircle, label: 'Chat VIP' },
];

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const packageId   = location.state?.packageId;
  const packageName = location.state?.packageName;
  const pkg = packageId ? getPackageById(packageId) : null;

  // Guard — someone accessing /payment/success directly without state
  useEffect(() => {
    if (!packageId) {
      navigate('/upgrade', { replace: true });
    }
  }, [packageId, navigate]);

  if (!packageId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4" style={{ background: '#F8FAFC' }}>
      <div className="text-center max-w-md w-full">

        {/* Crown glow */}
        <div className="relative mx-auto mb-8 w-28 h-28">
          {/* Outer pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(245,158,11,0.15)', animationDuration: '2s' }}
          />
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(245,158,11,0.15)',
              boxShadow: '0 0 50px rgba(245,158,11,0.25), 0 0 100px rgba(245,158,11,0.1)',
            }}
          >
            <Crown size={48} style={{ color: '#F59E0B' }} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-black mb-2" style={{ color: '#0F172A' }}>
          Chào mừng VIP! 🎉
        </h1>
        <p className="mb-1" style={{ color: '#475569' }}>
          Bạn đã kích hoạt thành công gói{' '}
          <span className="font-bold" style={{ color: '#0F172A' }}>{packageName ?? pkg?.name}</span>
        </p>
        <p className="text-sm mb-10" style={{ color: '#64748B' }}>
          Tất cả tính năng Premium đã được mở khóa ngay lập tức
        </p>

        {/* Unlocked features */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {UNLOCKED.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold"
              style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                color: '#D97706',
              }}
            >
              <Icon size={15} />
              {label} ✓
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]"
            style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #0891B2 100%)',
              minWidth: '200px',
            }}
          >
            Bắt đầu xem phim <ChevronRight size={16} />
          </Link>

          <Link
            to="/my-premium"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:bg-slate-100"
            style={{
              border: '1px solid #E2E8F0',
              color: '#475569',
              minWidth: '200px',
              background: '#fff',
            }}
          >
            Xem lịch sử gói
          </Link>
        </div>
      </div>
    </div>
  );
}
