import api from "./apiClient"; // Axios instance của bạn

export const showtimesApi = {
  // Lấy danh sách lịch chiếu (Public)
  getAllPublic: async () => {
    const res = await api.get("/showtimes");
    return res.data;
  },

  // Lấy chi tiết lịch chiếu (Public)
  getDetail: async (id) => {
    const res = await api.get(`/showtimes/${id}`);
    return res.data;
  },

  // Vào phòng xem công chiếu (Yêu cầu Token & Premium check từ BE)
  watchPremiere: async (id) => {
    const res = await api.get(`/showtimes/watch/${id}`);
    return res.data;
  },
};
