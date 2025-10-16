import { createContext } from "react";
import { useEffect, useState, useRef } from "react";
import axiosInstance, { interceptorsSetup } from "../service/axios";

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

        authRef.current = auth;
        setAuthState(auth);

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