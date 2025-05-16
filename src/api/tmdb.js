import axios from 'axios';

const API_KEY = '4c78dbb4bf6a3dcc8e3d350e3131633d';
const BASE_URL = 'https://api.themoviedb.org/3';

// TMDB 장르 ID (공식 문서 기준)
const GENRE_IDS = {
  tv: {
    news: 10763,
    talkshow: 10767,
    drama: 18
  },
  movie: {
    drama: 18
  }
};

const tmdbApi = {
  trending: () =>
    axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=ko-KR`),
  popular: () =>
    axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR`),
  upcoming: () =>
    axios.get(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko-KR`),
  topRated: () =>
    axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko-KR`),
  nowPlaying: () =>
    axios.get(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`),
  byGenre: (genreId) =>
    axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${genreId}`),
  discover: (params = '') =>
    axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR${params}`),

  // 비슷한 영화
  getSimilar: (movieId) =>
    axios.get(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=ko-KR`),

  // 영화 상세정보 (장르 등 포함)
  getMovieDetails: (movieId) =>
    axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`),

  // 장르 전체 리스트
  getGenres: () =>
    axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ko-KR`),

  // === VOD용 추가 메서드 ===

  // TV 프로그램: 특정 장르
  getTVByGenre: (genreId) =>
    axios.get(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=ko-KR&with_genres=${genreId}`),

  // 영화: 특정 장르
  getMovieByGenre: (genreId) =>
    axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${genreId}`),

  // TV 프로그램: 인기순
  getPopularTV: () =>
    axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ko-KR`),

  // TV 프로그램: 최신순
  getLatestTV: () =>
    axios.get(`${BASE_URL}/tv/latest?api_key=${API_KEY}&language=ko-KR`),

  // TV 프로그램: News
  getNewsTV: () =>
    axios.get(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=ko-KR&with_genres=${GENRE_IDS.tv.news}`),

  // TV 프로그램: Talkshow
  getTalkshowTV: () =>
    axios.get(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=ko-KR&with_genres=${GENRE_IDS.tv.talkshow}`),

  // TV 프로그램: Drama
  getDramaTV: () =>
    axios.get(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=ko-KR&with_genres=${GENRE_IDS.tv.drama}`),

  // 영화: Drama
  getDramaMovie: () =>
    axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${GENRE_IDS.movie.drama}`),
  
  // TV 상세정보 추가
  getTVDetails: (tvId) => 
    axios.get(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR`),
  getSimilarTV: (tvId) =>
    axios.get(`${BASE_URL}/tv/${tvId}/similar?api_key=${API_KEY}&language=ko-KR`),
};

export { GENRE_IDS };
export default tmdbApi;
