import { Link } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiUser, FiFilm, FiHome } from "react-icons/fi";
import devchilllogo from "../assets/devchill-logo.png";

export default function Register() {
  return (
    <div className="min-h-screen flex bg-dc-darker page-enter relative">
      {/* Home Navigation */}
      <Link
        to="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-full text-white/70 hover:text-[#00F2FF] hover:border-[#00F2FF]/40 hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all duration-300 group"
      >
        <FiHome className="text-xl group-hover:text-[#00F2FF] transition-colors duration-300" />
      </Link>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-dc-dark relative overflow-hidden">
        <div className="absolute -top-30 -left-20 w-75 h-75 bg-dc-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-25 -right-15 w-62.5 h-62.5 bg-dc-teal/5 rounded-full blur-3xl pointer-events-none" />

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
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Tạo tài khoản</h1>
              <p className="text-dc-text-muted text-sm mt-1">
                Đăng ký để trải nghiệm kho phim khổng lồ
              </p>
            </div>

            <form className="space-y-4">
              <div className="animate-float-in delay-2">
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-3 bg-dc-input-bg border border-dc-input-border rounded-xl text-dc-text placeholder:text-dc-text-muted/50 outline-none transition-all duration-250 input-glow"
                  />
                </div>
              </div>

              <div className="animate-float-in delay-3">
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

              <div className="animate-float-in delay-4">
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted"
                  >
                    <FiEye />
                  </button>
                </div>
              </div>

              <div className="animate-float-in delay-5">
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted" />
                  <input
                    type="confirm-password"
                    placeholder="confirm-password"
                    className="w-full pl-10 pr-12 py-3 bg-dc-input-bg border border-dc-input-border rounded-xl text-dc-text placeholder:text-dc-text-muted/50 outline-none transition-all duration-250 input-glow"
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dc-text-muted"
                  >
                    <FiEye />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="btn-cinematic w-full py-3.5 rounded-xl text-base flex items-center justify-center gap-2 animate-float-in delay-6"
              >
                Đăng ký
              </button>
            </form>

            <p className="text-center text-dc-text-muted text-sm mt-6 animate-float-in delay-6">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-dc-cyan font-medium hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>

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
            Tham gia cộng đồng
            <br />
            <span className="text-dc-cyan">yêu phim</span> lớn nhất
          </h2>
          <p className="mt-3 text-dc-text-muted text-sm max-w-xs animate-float-in delay-2">
            Tạo tài khoản miễn phí để xem phim không giới hạn và nhận gợi ý cá
            nhân hóa.
          </p>
        </div>
      </div>
    </div>
  );
}
