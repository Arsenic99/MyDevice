"use client"

import { useRouter } from 'next/navigation';
import React, { createContext, useEffect, useState } from 'react';

interface Token {
    id: string,
    email: string,
    password: string,
    createdAt: string,
    updatedAt: string
}

export const AuthContext = createContext({
    isAuthenticated: false,
    login: (user:Token) => { },
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

    const login = (user:Token) => {
        localStorage.setItem('token_key', JSON.stringify({id: user.id, email: user.email}))
        setIsAuthenticated(true);
    };
    const logout = () => {
        localStorage.removeItem('token_key')
        setIsAuthenticated(false);
        router.push('/login')
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
