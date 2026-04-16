/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useTransition, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getPublicMovies } from "../api/moviesPublicApi";
import SkeletonCard from "../components/SkeletonCard";
import Pagination from "../components/Pagination";
import { Star } from "lucide-react";

export default function MoviesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const filters = useMemo(() => {
    const get = (key) => searchParams.get(key) || "";

    return {
      page: Number(get("page")) || 1,
      keyword: get("keyword"),
      category: get("category"),
      country: get("country"),
      year: get("year"),
      lifecycle_status: get("lifecycle_status"),
    };
  }, [searchParams]);
  const title = useMemo(() => {
    return filters.lifecycle_status === "upcoming"
      ? "Phim sắp chiếu"
      : "Danh sách phim";
  }, [filters.lifecycle_status]);
  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      try {
        if (movies.length === 0) setLoading(true);
        const params = Object.fromEntries(searchParams.entries());
        const res = await getPublicMovies({
          ...params,
          limit: 10,
        });

        if (cancelled) return;
        const items = Array.isArray(res?.data) ? res.data : [];
        startTransition(() => {
          setMovies(items);
          setPagination(
            res?.pagination || {
              page: Number(params.page) || 1,
              limit: 10,
              total: items.length,
            },
          );
        });
      } catch (err) {
        console.error("Fetch movies error:", err);

        if (!cancelled) {
          setMovies([]);
          setPagination({
            page: 1,
            limit: 10,
            total: 0,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [searchParams]); 
  const totalPages = Math.ceil(
    (pagination.total || 0) / (pagination.limit || 10),
  );

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page);

    startTransition(() => {
      setSearchParams(params);
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">{title}</h1>
      <div className="min-h-135 relative">
        {movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Link
                key={`${movie.id}-${movie.slug}`}
                to={`/movies/${movie.slug}`}
                className="group rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition duration-300 relative"
              >
                <div className="overflow-hidden">
                  <img
                    src={movie.poster_url}
                    alt={movie.name}
                    className="h-64 w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium truncate group-hover:text-red-500">
                    {movie.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {movie.year || "N/A"}
                  </p>
                </div>

                {movie.is_premium && (
                  <div className="absolute top-3 right-3 bg-yellow-400 p-1.5 rounded-full">
                    <Star size={14} className="text-black" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        )}
        {!loading && movies.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            Không có phim nào.
          </div>
        )}
      </div>
      {!loading && totalPages >= 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      {isPending && (
        <div className="fixed bottom-5 right-5 text-sm text-gray-400">
          Đang tải...
        </div>
      )}
    </div>
  );
}
