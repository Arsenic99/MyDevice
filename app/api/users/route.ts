import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try{
        const body = await req.json();

        const {email, password} = body;

        if(!email) {
            return new NextResponse("Email is required", {status: 400});
        }

        if(!password) {
            return new NextResponse("Password is required", {status: 400});
        }

        const user = await prismadb.user.create({
            data: {
                email,
                password
            }
        })
        return NextResponse.json(user);
    } catch(error){
        console.log('[USERS_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}