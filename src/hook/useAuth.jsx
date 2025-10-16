import { useContext } from "react"
import AuthContext from "../context/AuthProvider"

const useAuth = () => {
    const {auth, setAuth, getAuth, authLoading} = useContext(AuthContext);

    return {auth, setAuth, getAuth, authLoading}
}

export default useAuth;