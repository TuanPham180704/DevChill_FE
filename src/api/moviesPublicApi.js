import api from "./apiClient.js";

export const getAllMovies = async (params) => {
  const res = await api.get("/movies", { params });
  return res.data;
};

export const getMovieById = async (id) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};

export const getRecommendMovies = async (id) => {
  const res = await api.get(`/movies/${id}/recommend`);
  return res.data;
};
