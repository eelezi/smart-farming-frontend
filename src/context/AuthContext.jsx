import React, { createContext, useState } from "react";
import { getStoredUser, isAuthenticated, logout } from "../services/authService.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser());
    const [authenticated, setAuthenticated] = useState(isAuthenticated());

    const handleLogout = () => {
        logout();
        setUser(null);
        setAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, authenticated, setUser, setAuthenticated, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
