import {
  FaTelegramPlane,
  FaDiscord,
  FaTimes,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import anhlogoweb from "../assets/devchill-logo.png";

export default function Footer() {
  return (
    <footer className="relative bg-white text-gray-700 border-t border-gray-200">
      <div className="absolute inset-0 bg-linear-to-t from-gray-50 to-transparent pointer-events-none" />

      <div className="w-full flex justify-center py-2 relative z-10">
        <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm">
          <svg viewBox="0 0 30 20" className="w-5 h-3.5">
            <rect width="30" height="20" fill="#DA1212" />
            <polygon
              points="15,3 17,9 23,9 18,12.5 20,18 15,14.5 10,18 12,12.5 7,9 13,9"
              fill="#FFEB3B"
            />
          </svg>
          <span>Hoàng Sa & Trường Sa là của Việt Nam</span>
        </div>
      </div>

      {/* FIX Ở ĐÂY */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-tr from-blue-500 to-indigo-500 rounded-full p-0.5">
                <img
                  src={anhlogoweb}
                  className="w-12 h-12 rounded-full bg-white object-cover"
                />
              </div>

              <div>
                <h2 className="text-gray-900 font-semibold">🎬 DevChill</h2>
                <p className="text-xs text-gray-500">Phim hay cả rổ</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              🎬 DevChill — xem phim online miễn phí, Vietsub & thuyết minh.
            </p>

            <div className="flex items-center gap-2">
              {[
                FaTelegramPlane,
                FaDiscord,
                FaTimes,
                FaFacebookF,
                FaTiktok,
                FaYoutube,
                FaInstagram,
              ].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-gray-100 hover:bg-blue-50 p-2 rounded-full transition"
                >
                  <Icon className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Trang</h3>

            <ul className="space-y-2 text-sm">
              {["Hỏi-Đáp", "Chính sách bảo mật", "Điều khoản sử dụng"].map(
                (t, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-blue-600 transition">
                      {t}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Danh mục</h3>

            <ul className="space-y-2 text-sm">
              {["Dongphim", "Ghienphim", "Motphim", "Subnhanh"].map((t, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-blue-600 transition">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Liên hệ</h3>

            <ul className="space-y-2 text-sm text-gray-600">
              {["Liên hệ quảng cáo", "Gửi link phim", "Báo lỗi nội dung"].map(
                (t, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-blue-600 transition">
                      {t}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 text-center py-3 text-xs text-gray-400">
        © {new Date().getFullYear()} 🎬 DevChill — Bản Quyền Thuộc Về KaiJun
      </div>
    </footer>
  );
}
