"use client"

import { AuthContext } from "@/providers/auth-provider"
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react"
import { Button } from "./ui/button";

interface Token {
    id: string,
    email: string,
    password: string,
    createdAt: string,
    updatedAt: string
}

export const UserPanel = () => {

    const user = useContext(AuthContext);
    const router = useRouter()
    const [token, setToken] = useState<Token | null>()


    useEffect(() => {
        const data = localStorage.getItem('token_key') || '';
        if(!data || data === ''){
            router.push('/login')
        }
        data && setToken(JSON.parse(data));
    },[])

    return (
        <div className="ml-auto flex items-center space-x-4 gap-2">
            {token && token.email}
            {token && <Button onClick={user.logout}>Выйти</Button>}
        </div>
    )
}