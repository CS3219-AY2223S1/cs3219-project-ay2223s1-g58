import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    useDebugValue(auth, auth => auth?.username ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;