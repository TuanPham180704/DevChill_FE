import api from "./apiClient.js";

// Lấy danh sách công chiếu (có phân trang, filter)
export const getAllShowtimesAdmin = async (params) => {
  const res = await api.get("/admin/showtimes", { params });
  return res.data;
};

// Lấy chi tiết 1 suất chiếu
export const getShowtimeByIdAdmin = async (id) => {
  const res = await api.get(`/admin/showtimes/${id}`);
  return res.data;
};

// Tạo suất chiếu mới
export const createShowtimeAdmin = async (data) => {
  const res = await api.post("/admin/showtimes", data);
  return res.data;
};

// Cập nhật suất chiếu
export const updateShowtimeAdmin = async (id, data) => {
  const res = await api.put(`/admin/showtimes/${id}`, data);
  return res.data;
};
