import { createContext, useState, useContext, useEffect } from "react";
import { login_request } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {

    const signin = async (user) => {
        try {
            const res = await login_request(user);
            console.log(res.data);
        } catch (err) {
            throw err; 
          }
    }

  

    useEffect(() => {
    async function checklogin() {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem("user");
        // if (!token) {
        //     setLoading(false);
        //     setUser(null);
        //     return;
        // }
        // try {
        //     setLoading(true);
        //     cargarDatos();
        //     cargarChoferes();
        //     setUser(JSON.parse(savedUser));
        //     setLoading(false);
        // } catch (error) {
        //     console.error(error);
        //     logout();
        //     setLoading(false);
        //     navigate('/login');
        // }

    }

    checklogin();
}, []);

return (
    <AuthContext.Provider value={{
        signin
    }}>
        {children}
    </AuthContext.Provider>

);
};



