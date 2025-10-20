import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const axiosInstance = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const interceptorsSetup = (getAuth, setAuth) => {
  // Attach token to a request
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = getAuth?.()?.accessToken;
      config.headers.Authorization = `Bearer ${accessToken}`;

      return config;
    },
    (err) => Promise.reject(err)
  );

  // Auth refresh token if Refresh Token is availble or still valid
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const statusCode = err?.response?.status;
      const originalRequest = err.config;

      if (statusCode === 401 && !originalRequest._retry) {
        // Set a _retry flag to avoid infinite loop
        originalRequest._retry = true;

        try {
          const res = await axiosInstance.get("/refresh", { _retry: true });
          const newAccessToken = res.data.accessToken;

          setAuth({
            ...getAuth?.(),
            accessToken: newAccessToken,
          });

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (error) {
          // Logout when fail to refresh token for user to login again
          logout(setAuth);

          return Promise.reject(err);
        }
      }

      return Promise.reject(err);
    }
  );
};

export const logout = (setAuth) => {
  axiosInstance
    .post("/logout")
    .then((res) => {
      setAuth(null);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const uploadFile = async (conversationId, file) => {
  if (!file) {
    console.error("File required");
    return;
  }

  if (!conversationId) {
    console.error("conversationId required");
    return;
  }

  if (!(file instanceof File)) {
    console.error("Not a valid file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("conversationId", conversationId);

  try {
    const res = await axiosInstance.post(`/messages/file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res?.data?.message;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export const uploadPublicFile = async (file) => {
  if (!file) {
    console.error("File required");
    return;
  }

  if (!(file instanceof File)) {
    console.error("Not a valid file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axiosInstance.post(`/files/profile`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res?.data?.path;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export default axiosInstance;
