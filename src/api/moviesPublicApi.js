import api from "./apiClient.js";

export const getPublicMovies = async (params) => {
  const res = await api.get("/movies", { params });
  return res.data;
};

export const getPublicMovieById = async (id) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};
export const getCategories = async () => {
  const res = await api.get("/movies/category");
  return res.data;
};
export const getCountries = async () => {
  const res = await api.get("/movies/country");
  return res.data;
};
export const getYears = async () => {
  const res = await api.get("/movies/year");
  return res.data;
};
export const searchMovies = async (keyword) => {
  const res = await api.get("/movies", {
    params: {
      keyword,
      page: 1,
      limit: 10,
    },
  });

  return res.data;
};
export const buildMovieQuery = (filters = {}) => {
  return {
    page: filters.page || 1,
    limit: filters.limit || 10,
    keyword: filters.keyword,
    type: filters.type,
    year: filters.year,
    category: filters.category,
    country: filters.country,
    status: filters.status,
  };
};
