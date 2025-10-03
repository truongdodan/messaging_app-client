import { createContext } from "react";
import { useEffect, useState, useRef } from "react";
import axiosInstance, { interceptorsSetup } from "../service/axios";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuthState] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const authRef = useRef(null);

    const setAuth = (auth) => {
        authRef.current = auth;
        setAuthState(auth);
    }
    const getAuth = () => authRef.current;

    // Refresh access token if Refresh token available everytimes user open app
    useEffect(() => {
        axiosInstance.get("/refresh")
        .then(res => {
            setAuth({
                accessToken: res?.data?.accessToken,
                user: res?.data?.user,
            });
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
            setAuthLoading(false);
        })

        // Setup interceptors
        interceptorsSetup(getAuth, setAuth);
    }, []);

    return (
        <AuthContext.Provider value={{auth, setAuth, getAuth, authLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;