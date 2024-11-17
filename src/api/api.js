import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});
let token = "a2sjdafaeajf5";

//request interceptor
api.interceptors.request.use(
  (config) => {
    // console.log(config);
    config.headers["Authorization"] = "Carried " + token;
    return config;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

// response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response) {
      // error came from server
      err.message = `Error from server: status: ${err.response.status} - message: ${err.response.statusText}`;
    }

    return Promise.reject(err);
  }
);

export default api;
