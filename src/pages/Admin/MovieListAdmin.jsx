/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { FaSearch, FaRedo, FaEye, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import Pagination from "../../components/Admin/Pagination";
import MoviesModal from "../../components/Admin/Movies/MoviesModal";

import { getAllMovies } from "../../api/moviesApi";

export default function MoviesListAdmin() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const [total, setTotal] = useState(0);

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  /* ================= FETCH ================= */
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getAllMovies({
        page,
        limit,
        keyword,
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
  }, [page, keyword, status, type]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  /* ================= HANDLER ================= */
  const handleOpenCreate = () => {
    setSelectedMovieId(null);
    setModalOpen(true);
  };

  const handleOpenDetail = (movie) => {
    setSelectedMovieId(movie.id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovieId(null);
  };

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <div className="flex-1 ml-64 flex flex-col">
        <div className="p-8 flex-1 flex flex-col gap-6">
          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý phim</h1>
            <p className="text-sm text-gray-500">
              Quản lý nội dung phim, tập và metadata 🎬
            </p>
          </div>

          {/* FILTER */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              {/* SEARCH */}
              <div className="relative w-72">
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Tìm phim..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* STATUS */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-sm border rounded-lg"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>

              {/* TYPE */}
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

            {/* ACTION */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchMovies}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg"
              >
                <FaRedo /> Refresh
              </button>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg"
              >
                <FaPlus /> Thêm phim
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl shadow flex-1 flex flex-col overflow-hidden">
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-center">Poster</th>
                    <th className="p-4 text-left">Tên</th>
                    <th className="p-4 text-center">Năm</th>
                    <th className="p-4 text-center">Loại</th>
                    <th className="p-4 text-center">Tập</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-6">
                        Đang tải...
                      </td>
                    </tr>
                  ) : movies.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-6 text-gray-400"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    movies.map((m) => (
                      <tr key={m.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">{m.id}</td>

                        {/* POSTER */}
                        <td className="p-4 text-center">
                          <div className="w-14 h-20 mx-auto rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                            {m.poster_url ? (
                              <img
                                src={m.poster_url}
                                alt={m.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">
                                No Image
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 font-medium">{m.name}</td>

                        <td className="p-4 text-center">{m.year || "-"}</td>

                        <td className="p-4 text-center">{m.type || "-"}</td>

                        <td className="p-4 text-center">
                          {m.episode_total || 0}
                        </td>

                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              m.status === "completed"
                                ? "bg-green-100 text-green-600"
                                : m.status === "draft"
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleOpenDetail(m)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
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

          {/* PAGINATION */}
          <div className="bg-white border-t py-3 flex justify-center shadow-inner mt-auto">
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

      {/* MODAL */}
      {isModalOpen && (
        <MoviesModal
          movieId={selectedMovieId}
          onClose={handleCloseModal}
          onReload={fetchMovies}
        />
      )}
    </div>
  );
}
