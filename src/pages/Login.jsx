import { Link } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiFilm, FiHome } from "react-icons/fi";
import devchilllogo from "../assets/devchill-logo.png";

export default function Login() {
  return (
    <div className="min-h-screen flex bg-dc-darker page-enter">
      {/* Home Navigation */}
      <Link
        to="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-full text-white/70 hover:text-[#00F2FF] hover:border-[#00F2FF]/40 hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all duration-300 group"
      >
        <FiHome className="text-xl group-hover:text-[#00F2FF] transition-colors duration-300" />
      </Link>
   
      <div className="hidden lg:flex w-[40%] relative cinematic-overlay overflow-hidden items-end">
        <img
          src={devchilllogo}
          alt="DevChill Cinema"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 p-10 pb-16">
          <div className="flex items-center gap-3 mb-4 animate-float-in">
            <div className="w-10 h-10 rounded-xl bg-dc-cyan/20 flex items-center justify-center">
              <FiFilm className="text-dc-cyan text-xl" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">
              Dev<span className="text-dc-cyan text-glow">Chill</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight animate-float-in delay-1">
            Khám phá thế giới
            <br />
            <span className="text-dc-cyan">điện ảnh</span> tuyệt vời
          </h2>
          <p className="mt-3 text-dc-text-muted text-sm max-w-xs animate-float-in delay-2">
            Hàng ngàn bộ phim bom tấn, series hot nhất đang chờ bạn. Đăng nhập
            để bắt đầu trải nghiệm.
          </p>
        </div>
      </div>

   
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-dc-dark relative overflow-hidden">
   
        <div className="absolute -top-30 -right-20 w-75 h-75 bg-dc-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-25 -left-15 w-62.5 h-62.5 bg-dc-teal/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md">
      
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center animate-float-in">
            <div className="w-10 h-10 rounded-xl bg-dc-cyan/20 flex items-center justify-center">
              <FiFilm className="text-dc-cyan text-xl" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">
              Dev<span className="text-dc-cyan text-glow">Chill</span>
            </span>
          </div>

       
          <div className="glass-card rounded-2xl p-8 animate-float-in delay-1">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Đăng nhập</h1>
              <p className="text-dc-text-muted text-sm mt-1">
                Chào mừng trở lại! Hãy đăng nhập để tiếp tục.
              </p>
            </div>

            <form className="space-y-5">
        
              <div className="animate-float-in delay-2">
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-dc-input-bg border border-dc-input-border rounded-xl text-dc-text placeholder:text-dc-text-muted/50 outline-none transition-all duration-250 input-glow"
                  />
                </div>
              </div>

          
              <div className="animate-float-in delay-3">
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted" />
                  <input
                    type="password"
                    placeholder="password"
                    className="w-full pl-10 pr-12 py-3 bg-dc-input-bg border border-dc-input-border rounded-xl text-dc-text placeholder:text-dc-text-muted/50 outline-none transition-all duration-250 input-glow"
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted hover:text-dc-cyan"
                  >
                    <FiEye />
                  </button>
                </div>
              </div>

          
              <div className="flex items-center justify-between text-sm animate-float-in delay-4">
                <label className="flex items-center gap-2 text-dc-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-dc-cyan w-4 h-4 rounded"
                  />
                  Ghi nhớ đăng nhập
                </label>
                <Link
                  to="/forgot-password"
                  title="Chưa làm trang này"
                  className="text-dc-cyan hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

    
              <button
                type="button"
                className="btn-cinematic w-full py-3.5 rounded-xl text-base flex items-center justify-center gap-2 animate-float-in delay-5"
              >
                Đăng nhập
              </button>
            </form>

     
            <div className="flex items-center gap-3 my-6 animate-float-in delay-5">
              <div className="flex-1 h-px bg-dc-card-border" />
              <span className="text-dc-text-muted text-xs">HOẶC</span>
              <div className="flex-1 h-px bg-dc-card-border" />
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="w-full py-3 rounded-xl border border-dc-input-border bg-dc-input-bg text-dc-text hover:border-dc-cyan/30 hover:bg-dc-cyan/5 transition-all duration-250 flex items-center justify-center gap-2 text-sm font-medium animate-float-in delay-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </button>

            {/* Register link */}
            <p className="text-center text-dc-text-muted text-sm mt-6 animate-float-in delay-6">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-dc-cyan font-medium hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}