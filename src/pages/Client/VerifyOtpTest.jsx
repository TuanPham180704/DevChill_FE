import { ShieldCheck, Film, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function VerifyOtpTest() {
  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: '#0D0D0D' }}>
      {/* ─── Background Effects ───────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.05) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(0,10,30,0) 0%, #0D0D0D 80%)' }} />
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px] opacity-20" style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)' }} />

      {/* ─── Top-Left Logo ───────────────────────────────────────────── */}
      <div className="absolute top-8 left-8 sm:top-10 sm:left-12 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', boxShadow: '0 0 24px rgba(0,212,255,0.3)' }}>
            <Film size={20} className="text-white" />
          </div>
          <span className="text-xl font-black text-white" style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DevChill</span>
        </div>
      </div>

      {/* ─── Verification Card ────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[480px] px-6 flex flex-col items-center">
        {/* Card */}
        <div className="w-full p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(30px)' }}>
          <div className="flex flex-col items-center text-center">
            {/* Header Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mb-6 sm:mb-8 relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-20" style={{ background: '#00D4FF' }} />
              <div className="w-full h-full rounded-3xl border border-white/[0.1] flex items-center justify-center bg-white/[0.02]">
                <ShieldCheck size={28} className="sm:w-8 sm:h-8" style={{ color: '#00D4FF' }} />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 sm:mb-3">Xác thực OTP</h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-8 sm:mb-10 max-w-[280px]">
              <span className="text-white font-bold">Nhập mã 6 chữ số đã gửi đến</span><br />
              <span className="text-[#00D4FF] font-semibold">nguyenvnhattan2@dtu.edu.vn</span>
            </p>

            {/* OTP Inputs */}
            <div className="flex gap-1.5 sm:gap-3 mb-8 sm:mb-10">
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  onKeyDown={(e) => {
                    if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight|Delete/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                  className="w-10 h-14 sm:w-14 sm:h-20 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.1] text-center text-xl sm:text-2xl font-black text-white outline-none focus:border-[#00D4FF] focus:ring-4 focus:ring-[#00D4FF]/10 transition-all"
                  placeholder={i === 0 ? "│" : ""}
                />
              ))}
            </div>

            {/* Confirm Button */}
            <button className="w-full py-3.5 sm:py-4.5 rounded-xl sm:rounded-2xl text-white font-black text-sm tracking-wide transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] mb-6 sm:mb-8" 
              style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)' }}>
              Xác nhận OTP
            </button>

            {/* Footer Links */}
            <div className="flex flex-col items-center gap-5 sm:gap-6">
              <p className="text-[13px] sm:text-sm text-gray-500">
                Không nhận được mã? <button className="text-[#00D4FF] font-bold hover:underline transition-all">Gửi lại (300s)</button>
              </p>
              
              <Link to="/logintest" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#00D4FF] hover:text-white hover:bg-[#00D4FF]/20 transition-all font-bold text-[13px] sm:text-sm">
                <ArrowLeft size={16} />
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>

        {/* Global Design Watermark (Subtle) */}
        <div className="mt-8 text-center text-[9px] font-bold text-gray-800 uppercase tracking-[0.4em] select-none opacity-50">
          Secure Auth Framework
        </div>
      </div>
    </div>
  );
}
