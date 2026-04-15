/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useMemo } from "react";
import { FaSearch, FaRedo, FaEye, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import MoviesModal from "../../components/Admin/Movies/MoviesModal";

import { getAllMovies } from "../../api/moviesAdminApi";

export default function MoviesListAdmin() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [total, setTotal] = useState(0);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("edit");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getAllMovies({
        page,
        limit,
        keyword: debouncedKeyword,
        status,
        type,
      });

      setMovies(res?.data || []);
      setTotal(res?.pagination?.total || 0);
    } catch (err) {
      toast.error("Lỗi tải danh sách phim");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedKeyword, status, type]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const stats = useMemo(() => {
    return {
      totalMovies: movies.length,
      draft: movies.filter((m) => m.status === "draft").length,
      published: movies.filter((m) => m.status === "published").length,
      hidden: movies.filter((m) => m.status === "hidden").length,
    };
  }, [movies]);

  const csvData = movies.map((m) => ({
    ID: m.id,
    Ten: m.name,
    Nam: m.year,
    Loai: m.type,
    Tap: m.episode_total,
    Trang_thai: m.status,
  }));

  const handleOpenCreate = () => {
    setSelectedMovieId(null);
    setMode("create");
    setModalOpen(true);
  };

  const handleOpenDetail = (movie) => {
    setSelectedMovieId(movie.id);
    setMode("edit");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovieId(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <div className="flex-1 ml-64 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Quản lý phim</h1>
            <p className="text-sm text-gray-500">Quản lý nội dung phim 🎬</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              ["Tổng", stats.totalMovies, "blue"],
              ["Draft", stats.draft, "yellow"],
              ["Published", stats.published, "green"],
              ["Hidden", stats.hidden, "red"],
            ].map(([label, value, color]) => (
              <div
                key={label}
                className="bg-white p-3 rounded-lg shadow text-center"
              >
                <div className={`text-xl font-bold text-${color}-600`}>
                  {value}
                </div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="flex gap-2 flex-wrap">
              <div className="relative w-64">
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm phim..."
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg"
                />
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-sm border rounded-lg"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
              </select>

              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-sm border rounded-lg"
              >
                <option value="">Tất cả loại</option>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
            </div>

            <div className="flex gap-2">
              <ExportCSV
                data={csvData}
                fields={["ID", "Ten", "Nam", "Loai", "Tap", "Trang_thai"]}
                fileName="DanhSachPhim"
              />

              <button
                onClick={fetchMovies}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaRedo />
                Refresh
              </button>

              <button
                onClick={handleOpenCreate}
                className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg flex items-center gap-2"
              >
                <FaPlus />
                Thêm
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow flex-1 overflow-hidden">
            <div className="overflow-auto">
              <table className="w-full text-xs table-fixed">
                <thead className="bg-gray-100 text-gray-500 uppercase">
                  <tr>
                    <th className="p-2 w-15">ID</th>
                    <th className="p-2 w-20">Poster</th>
                    <th className="p-2 w-55 text-left">Tên</th>
                    <th className="p-2 w-20">Năm</th>
                    <th className="p-2 w-20">Loại</th>
                    <th className="p-2 w-20">Tập</th>
                    <th className="p-2 w-25">Premium</th>
                    <th className="p-2 w-25">Status</th>
                    <th className="p-2 w-20">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : movies.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No data
                      </td>
                    </tr>
                  ) : (
                    movies.map((m) => (
                      <tr key={m.id} className="border-t hover:bg-gray-50">
                        <td className="p-2 text-center">{m.id}</td>

                        <td className="p-2">
                          <img
                            src={m.poster_url}
                            className="w-10 h-14 object-cover rounded mx-auto"
                          />
                        </td>

                        <td className="p-2 text-left truncate">{m.name}</td>

                        <td className="p-2 text-center">{m.year || "-"}</td>
                        <td className="p-2 text-center">{m.type}</td>
                        <td className="p-2 text-center">{m.episode_total}</td>

                        <td className="p-2 text-center">
                          {m.is_premium ? "VIP" : "Free"}
                        </td>

                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs
                              ${
                                m.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : ""
                              }
                              ${
                                m.status === "draft"
                                  ? "bg-gray-100 text-gray-700"
                                  : ""
                              }
                              ${
                                m.status === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : ""
                              }
                              ${
                                m.status === "expired"
                                  ? "bg-red-100 text-red-700"
                                  : ""
                              }
                            `}
                          >
                            {m.status}
                          </span>
                        </td>

                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleOpenDetail(m)}
                            className="p-1 bg-blue-100 rounded text-blue-600"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white py-2 flex justify-center rounded-lg">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / limit)}
              onPageChange={setPage}
              totalItems={total}
              itemsPerPage={limit}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <MoviesModal
          movieId={selectedMovieId}
          mode={mode}
          onClose={handleCloseModal}
          onReload={fetchMovies}
        />
      )}
    </div>
  );
}
