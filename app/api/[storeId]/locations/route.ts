import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const body = await req.json();

        const { name, id } = body;

        if (!id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const location = await prismadb.location.create({
            data: {
                name,
                storeId: params.storeId
            }
        })
        return NextResponse.json(location);
    } catch (error) {
        console.log('[LOCATIONS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const locations = await prismadb.location.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(locations);
    } catch (error) {
        console.log('[LOCATIONS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};