import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeToken } from "../utils/auth";
import { useState, useEffect, useRef } from "react";
import { FaUser, FaCrown } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import axios from "axios";
import SearchBox from "./SearchBox";
import { toast } from "react-toastify";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
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
        console.error("Load filter error:", err);
      }
    };

    fetchData();
  }, []);
  const buildLink = (key, value) => {
    const params = new URLSearchParams(location.search);

    if (!value) return "/movies";

    params.set(key, value);
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
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white text-gray-700 border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-2xl"
              onClick={() => setMobileOpen(true)}
            >
              <HiMenu />
            </button>

            <Link to="/" className="font-bold text-gray-800">
              🎬 DevChill
            </Link>

            <div className="hidden sm:block">
              <SearchBox />
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link
              to={buildLink("type", "movie")}
              className="hover:text-blue-600"
            >
              Phim Lẻ
            </Link>

            <Link
              to={buildLink("type", "series")}
              className="hover:text-blue-600"
            >
              Phim Bộ
            </Link>

            <Dropdown
              title="Thể loại"
              items={categories}
              onSelect={(s) => buildLink("category", s)}
            />
            <Dropdown
              title="Quốc gia"
              items={countries}
              onSelect={(s) => buildLink("country", s)}
            />
            <Dropdown
              title="Năm"
              items={years}
              onSelect={(s) => buildLink("year", s)}
            />

            <button
              onClick={handleGoPremium}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500"
            >
              <FaCrown className="inline mr-1" />
              Premium
            </button>
          </nav>
          <div className="flex items-center gap-3">
            {token ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full"
                >
                  <FaUser />
                  Tài khoản
                </button>
                {openUserMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg py-2">
                    <Link
                      className="block px-4 py-2 hover:bg-gray-100"
                      to="/profile"
                    >
                      Hồ sơ
                    </Link>
                    <Link
                      className="block px-4 py-2 hover:bg-gray-100"
                      to="/my-tickets"
                    >
                      Vé đã đặt
                    </Link>
                    <Link
                      className="block px-4 py-2 hover:bg-gray-100"
                      to="/my-premium"
                    >
                      Premium
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
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
        <div className="p-4 border-b font-bold flex justify-between">
          Menu
          <button onClick={() => setMobileOpen(false)}>✕</button>
        </div>

        <div className="p-4 flex flex-col gap-3 text-sm">
          <Link
            onClick={() => setMobileOpen(false)}
            to={buildLink("type", "movie")}
          >
            Phim Lẻ
          </Link>

          <Link
            onClick={() => setMobileOpen(false)}
            to={buildLink("type", "series")}
          >
            Phim Bộ
          </Link>

          <MobileDropdown
            title="Thể loại"
            items={categories}
            onSelect={buildLink}
            setOpen={setMobileOpen}
            type="category"
          />
          <MobileDropdown
            title="Quốc gia"
            items={countries}
            onSelect={buildLink}
            setOpen={setMobileOpen}
            type="country"
          />
          <MobileDropdown
            title="Năm"
            items={years}
            onSelect={buildLink}
            setOpen={setMobileOpen}
            type="year"
          />

          <button
            onClick={() => {
              setMobileOpen(false);

              if (!token) {
                toast.warning("Bạn cần đăng nhập để vào Premium!");
                navigate("/login");
                return;
              }

              navigate("/premium");
            }}
            className="text-blue-600 font-semibold text-left"
          >
            Premium
          </button>
        </div>
      </div>
    </>
  );
}
function Dropdown({ title, items = [], onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="hover:text-blue-600">{title}</button>

      {open && (
        <div className="absolute top-full mt-2 w-48 bg-white border rounded shadow-lg p-2 z-50">
          {items.map((item, idx) => (
            <Link
              key={idx}
              to={onSelect(item.slug)}
              className="block px-3 py-1.5 hover:bg-gray-100 text-sm rounded"
            >
              {item.name || item.year}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
function MobileDropdown({ title, items = [], type, onSelect, setOpen }) {
  const navigate = useNavigate();

  return (
    <details className="border-b pb-2">
      <summary className="cursor-pointer font-medium">{title}</summary>

      <div className="flex flex-col gap-2 pl-3 mt-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            className="text-left hover:text-blue-600"
            onClick={() => {
              navigate(onSelect(type, item.slug));
              setOpen(false);
            }}
          >
            {item.name || item.year}
          </button>
        ))}
      </div>
    </details>
  );
}
