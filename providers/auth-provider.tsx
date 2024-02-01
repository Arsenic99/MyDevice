"use client"

import { useRouter } from 'next/navigation';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
    isAuthenticated: false,
    login: (user:any) => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(()=>{
        const token = localStorage.getItem('token_key')
        if(!token){
            router.push('/login')
        }
    },[])

    const login = (user:any) => {
        console.log(user)
        localStorage.setItem('token_key', JSON.stringify(user))
        setIsAuthenticated(true);
    };
    const logout = () => {
        localStorage.removeItem('token_key')
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
