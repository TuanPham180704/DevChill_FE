import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { searchMovies } from "../api/moviesPublicApi";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const [suggests, setSuggests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  // ✅ FIX: tránh re-set input sau khi clear/search
  const skipSyncRef = useRef(false);

  /* ================= INIT FROM URL ================= */
  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }

    const params = new URLSearchParams(location.search);
    setSearch(params.get("keyword") || "");
  }, [location.search]);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const q = search.trim();

    if (!q) {
      setSuggests([]);
      setShowSuggest(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await searchMovies(q);

        const data = res?.data?.data ?? res?.data ?? [];

        const filtered = data.filter((m) =>
          m?.name?.toLowerCase().includes(q.toLowerCase()),
        );

        setSuggests(filtered);
        setShowSuggest(true);
      } catch (err) {
        console.error("search error:", err);
        setSuggests([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [search]);

  /* ================= SEARCH SUBMIT ================= */
  const handleSearch = (e) => {
    e.preventDefault();

    const q = search.trim();
    if (!q) return;

    skipSyncRef.current = true;

    const params = new URLSearchParams(location.search);
    params.set("keyword", q);
    params.set("page", "1");

    navigate(`/movies?${params.toString()}`);

    setSearch("");
    setSuggests([]);
    setShowSuggest(false);
  };

  /* ================= CLEAR ================= */
  const clearSearch = () => {
    skipSyncRef.current = true;

    setSearch("");
    setSuggests([]);
    setShowSuggest(false);

    const params = new URLSearchParams(location.search);
    params.delete("keyword");
    params.set("page", "1");

    navigate(`/movies?${params.toString()}`);
  };

  /* ================= SELECT MOVIE ================= */
  const handleSelectMovie = (movie) => {
    skipSyncRef.current = true;

    setSearch("");
    setSuggests([]);
    setShowSuggest(false);

    navigate(`/movies/${movie.slug}`);
  };

  return (
    <div className="relative w-72">
      {/* ================= INPUT ================= */}
      <form
        onSubmit={handleSearch}
        className="flex items-center h-10 px-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition focus-within:ring-2 focus-within:ring-blue-400/40"
      >
        <FaSearch className="text-gray-400 text-sm mr-2" />

        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search.trim() && setShowSuggest(true)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700"
        />

        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="ml-2 text-gray-400 hover:text-red-500"
          >
            <FaTimes className="text-xs" />
          </button>
        )}
      </form>

      {/* ================= SUGGEST ================= */}
      {showSuggest && search.trim() && (
        <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
          {loading && (
            <div className="p-2 text-sm text-gray-400">Đang tìm...</div>
          )}

          {!loading && suggests.length === 0 && (
            <div className="p-2 text-sm text-gray-400">Không có kết quả</div>
          )}

          {!loading &&
            suggests.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleSelectMovie(movie)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {movie.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
