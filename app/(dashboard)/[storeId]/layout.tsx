import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
    params
}:{
    children: React.ReactNode,
    params: {storeId: string}
}) {

    const store = await prismadb.store.findFirst({
        where:{
            id: params.storeId,
        }
    });

    if(!store){
        redirect('/');
    }

    return(
        <>
            <Navbar />
            {
                children
            }
        </>
    )
}