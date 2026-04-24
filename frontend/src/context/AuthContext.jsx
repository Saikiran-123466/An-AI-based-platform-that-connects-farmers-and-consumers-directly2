import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // ✅ LOGIN
    const login = async (email, password) => {
        const res = await axios.post(
            'https://agrilink-backend-dhvp.onrender.com/api/auth/login',
            { email, password }
        );

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);

        return res.data;
    };

    // ✅ REGISTER
    const register = async (name, email, password, role, location) => {
        const res = await axios.post(
            'https://agrilink-backend-dhvp.onrender.com/api/auth/register',
            { name, email, password, role, location }
        );

        return res.data;
    };

    // ✅ LOGOUT
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};