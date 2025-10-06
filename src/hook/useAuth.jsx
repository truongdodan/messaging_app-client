import { useContext, useEffect } from "react"
import AuthContext from "../context/AuthProvider"
import { getFileUrl } from "../service/axios";

const useAuth = () => {
    const {auth, setAuth, getAuth, authLoading} = useContext(AuthContext);

    return {auth, setAuth, getAuth, authLoading}
}

export default useAuth;