import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { locationId: string } }
) {
    try {

        if (!params.locationId) {
            return new NextResponse("Location id is required", { status: 400 });
        }

        const location = await prismadb.location.findUnique({
            where: {
                id: params.locationId,
            }
        });

        return NextResponse.json(location);
    } catch (error) {
        console.log('[LOCATION_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, locationId: string } }
) {
    try {
        const body = await req.json();

        const { name, id, responsiblePerson } = body;

        if (!id) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!responsiblePerson) {
            return new NextResponse("Responsible person is required", { status: 400 });
        }

        if (!params.locationId) {
            return new NextResponse("Location id is required", { status: 400 });
        }

        const location = await prismadb.location.updateMany({
            where: {
                id: params.locationId,
            },
            data: {
                name,
                responsiblePerson
            }
        });

        return NextResponse.json(location);
    } catch (error) {
        console.log('[LOCATION_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, locationId: string } }
) {
    try {

        if (!params.locationId) {
            return new NextResponse("Location id is required", { status: 400 });
        }

        const location = await prismadb.location.deleteMany({
            where: {
                id: params.locationId,
            }
        });

        return NextResponse.json(location);
    } catch (error) {
        console.log('[LOCATION_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};