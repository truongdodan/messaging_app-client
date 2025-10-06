import { createContext } from "react";
import { useEffect, useState, useRef } from "react";
import axiosInstance, { getFileUrl, interceptorsSetup } from "../service/axios";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuthState] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const authRef = useRef(null);

    const setAuth = async (auth) => {
        if (!auth) {
            authRef.current = null;
            setAuthState(null);
            return;
        }

        const isValidUrl = (value) => {
            try {
                const url = new URL(value);

                return url.protocol === "https:" || url.protocol === "http:";
            } catch {
                return false;
            }
        }

        let profileUrl;
        let coverUrl;

        try {
            // check if profile url need to be fetch
            if (auth?.user?.profileUrl && !isValidUrl(auth?.user?.profileUrl)) {
                profileUrl = await getFileUrl(auth.user.profileUrl);
            }

            // check if cover url need to be fetch
            if (auth?.user?.coverUrl && !isValidUrl(auth?.user?.coverUrl)) {
                coverUrl = await getFileUrl(auth.user.coverUrl);
            }

            const authWithUrl = {
                ...auth,
                user: {
                    ...auth.user,
                    ...(profileUrl && {profileUrl: profileUrl}),
                    ...(coverUrl && {coverUrl: coverUrl}),
                }
            };

            authRef.current = authWithUrl;
            setAuthState(authWithUrl);
            return;
        } catch (error) {
            console.error("Error fetching profile or cover url: ", error);
            authRef.current = auth
            setAuthState(auth);
        }

    }
    const getAuth = () => authRef.current;

    // Refresh access token if Refresh token available everytimes user open app
    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await axiosInstance.get("/refresh");
            
                await setAuth({
                    accessToken: res?.data?.accessToken,
                    user: res?.data?.user,
                });
            } catch (error) {
                console.error("Refresh token error:", error);
                // User stays logged out
            } finally {
                setAuthLoading(false)
            }
        }

        initAuth();
        interceptorsSetup(getAuth, setAuth);
    }, []);

    return (
        <AuthContext.Provider value={{auth, setAuth, getAuth, authLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;