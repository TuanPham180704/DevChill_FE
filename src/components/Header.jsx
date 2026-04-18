import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";
import { useState, useEffect, useRef } from "react";
import { FaUser, FaCrown } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import axios from "axios";
import SearchBox from "./SearchBox";
import { toast } from "react-toastify";
import { getProfile } from "../api/userApi";
export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userMenuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, countryRes, yearRes] = await Promise.all([
          axios.get("http://localhost:8080/api/movies/category"),
          axios.get("http://localhost:8080/api/movies/country"),
          axios.get("http://localhost:8080/api/movies/year"),
        ]);

        setCategories(catRes.data?.data?.data || []);
        setCountries(countryRes.data?.data?.data || []);
        setYears(yearRes.data?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [token]);
  const buildLink = (key, value) => {
    const params = new URLSearchParams();
    if (key && value) params.set(key, value);
    params.set("page", "1");
    return `/movies?${params.toString()}`;
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
    toast.info("Đã đăng xuất!");
  };

  const handleGoPremium = () => {
    if (!token) {
      toast.warning("Bạn cần đăng nhập để vào Premium!");
      navigate("/login");
      return;
    }
    navigate("/premium");
  };

  return (
    <>
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-2xl"
              onClick={() => setMobileOpen(true)}
            >
              <HiMenu />
            </button>

            <Link to="/" className="font-bold text-xl">
              🎬 DevChill
            </Link>

            <div className="hidden sm:block">
              <SearchBox />
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button onClick={() => navigate(buildLink("type", "movie"))}>
              Phim Lẻ
            </button>

            <button onClick={() => navigate(buildLink("type", "series"))}>
              Phim Bộ
            </button>

            <Dropdown
              title="Thể loại"
              items={categories}
              type="category"
              buildLink={buildLink}
            />
            <Dropdown
              title="Quốc gia"
              items={countries}
              type="country"
              buildLink={buildLink}
            />
            <Dropdown
              title="Năm"
              items={years}
              type="year"
              buildLink={buildLink}
            />
            <button
              onClick={handleGoPremium}
              className="text-blue-600 font-semibold"
            >
              <FaCrown className="inline mr-1" />
              Premium
            </button>
          </nav>
          <div className="flex items-center gap-3">
            {token ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setOpenUserMenu((p) => !p)}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition"
                >
          
                  <img
                    src={user?.avatar_url || "/default-avatar.png"}
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="font-medium">
                    {user?.username || "User"}
                  </span>
                  {user?.is_premium ? (
                    <FaCrown className="text-yellow-500" title="Premium" />
                  ) : (
                    <span className="text-xs text-gray-500"></span>
                  )}
                </button>
                <div
                  className={`absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-2 transition-all duration-200
        ${
          openUserMenu
            ? "opacity-100 visible pointer-events-auto translate-y-0"
            : "opacity-0 invisible pointer-events-none -translate-y-2"
        }`}
                >
                  {/* Info user */}
                  <div className="px-4 py-3 border-b flex items-center gap-3">
                    <img
                      src={user?.avatar_url || "/default-avatar.png"}
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                      className="w-10 h-10 rounded-full border"
                    />

                    <div>
                      <div className="font-semibold text-sm">
                        {user?.username}
                      </div>

                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {user?.is_premium ? (
                          <>
                            <FaCrown className="text-yellow-500" />
                            Premium
                          </>
                        ) : (
                          "Free"
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Hồ sơ
                  </Link>

                  <Link
                    to="/my-tickets"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Vé đã đặt
                  </Link>

                  <Link
                    to="/my-premium"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Premium
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 bg-gray-100 rounded-full"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-full"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b flex justify-between font-bold">
          Menu
          <button onClick={() => setMobileOpen(false)}>✕</button>
        </div>

        <div className="p-4 flex flex-col gap-3 text-sm">
          <button onClick={() => navigate(buildLink("type", "movie"))}>
            Phim Lẻ
          </button>
          <button onClick={() => navigate(buildLink("type", "series"))}>
            Phim Bộ
          </button>

          <MobileDropdown
            title="Thể loại"
            items={categories}
            type="category"
            buildLink={buildLink}
          />
          <MobileDropdown
            title="Quốc gia"
            items={countries}
            type="country"
            buildLink={buildLink}
          />
          <MobileDropdown
            title="Năm"
            items={years}
            type="year"
            buildLink={buildLink}
          />
        </div>
      </div>
    </>
  );
}

function Dropdown({ title, items = [], type, buildLink }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`px-3 py-2 rounded ${open ? "text-blue-600" : "hover:bg-gray-100"}`}
      >
        {title}
      </button>

      <div
        className={`absolute top-full left-0 mt-2 w-52 bg-white border shadow-lg rounded transition-all duration-200 z-50
        ${open ? "opacity-100 visible pointer-events-auto translate-y-0" : "opacity-0 invisible pointer-events-none -translate-y-2"}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item.id || item.slug}
              onClick={() => {
                navigate(buildLink(type, item.slug));
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              {item.name || item.year}
            </button>
          ))
        ) : (
          <div className="px-3 py-2 text-gray-400 text-sm">Đang tải...</div>
        )}
      </div>
    </div>
  );
}

function MobileDropdown({ title, items = [], type, buildLink }) {
  const navigate = useNavigate();

  return (
    <details className="border-b pb-2">
      <summary className="cursor-pointer font-medium">{title}</summary>

      <div className="flex flex-col gap-2 pl-3 mt-2">
        {items.map((item) => (
          <button
            key={item.id || item.slug}
            className="text-left hover:text-blue-600"
            onClick={() => navigate(buildLink(type, item.slug))}
          >
            {item.name || item.year}
          </button>
        ))}
      </div>
    </details>
  );
}
