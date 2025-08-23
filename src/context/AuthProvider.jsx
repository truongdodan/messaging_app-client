const { createContext, useState, useRef } = require("react");

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

    return (
        <AuthContext.Provider value={{auth, setAuth, getAuth, authLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;