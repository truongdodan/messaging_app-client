import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const interceptorsSetup = (getAuth, setAuth) => {
    // Attach token to a request
    axiosInstance.interceptors.request.use((config) => {
        const accessToken = getAuth?.()?.accessToken;
        config.headers.Authorization = `Bearer ${accessToken}`

        return config;
    }, (err) => Promise.reject(err));


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
                    const res = await axiosInstance.get("/refresh", {_retry: true});
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
}

export const logout = (setAuth) => {
    axiosInstance.post("/logout")
        .then(res => {
            setAuth(null);
        })
        .catch(err => {
            console.error(err);
        })
}

export const getFileUrl = async (fileName) => {
    if (!fileName) {
        console.error("File name required");
        return null;
    }

    if (typeof fileName !== 'string') {
        console.error("File name have to be a String");
        return null;
    }

    try {
        const res = await axiosInstance.get(`/messages/file/sign-url?path=${fileName}`);

        return res.data.signedUrl;
    } catch (error) {
        console.error(`Failed getting file url: `, error);
        return null;
    }
}

export const uploadFile = async (fileInput) => {
    if (!fileInput) {
        console.error("File required");
        return;
    }

    if (!fileInput instanceof File) {
        console.error("Not a input file");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput);
    

    try {
        const res = await axiosInstance.post(`/messages/file`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res?.data?.path;
    } catch (error) {
        console.error('Fail upload file: ', error);
        return null;
    }
}

export default axiosInstance;

