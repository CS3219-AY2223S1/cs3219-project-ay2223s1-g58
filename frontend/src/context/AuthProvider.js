import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: "",
        username: "",
        email: "",
        school: "",
        isLoggedIn: false,
    });
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist:peerprep")) || false);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;