import { getApiBaseUrl } from "../utils/getApiBaseUrl";

const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),       // ⬅ dynamic base URL
  TIMEOUT: 15000,
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
  RETRY_ATTEMPTS: 2,
  CACHE_DURATION: 5 * 60 * 1000,
};

export default API_CONFIG;
