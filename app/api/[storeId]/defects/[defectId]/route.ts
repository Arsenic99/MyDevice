import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { defectId: string } }
) {
    try {
        if (!params.defectId) {
            return new NextResponse("Defect id is required", { status: 400 });
        }

        const defect = await prismadb.defect.findUnique({
            where: {
                id: params.defectId
            },
        });

        return NextResponse.json(defect);
    } catch (error) {
        console.log('[DEFECT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { defectId: string, storeId: string } }
) {
    try {

        if (!params.defectId) {
            return new NextResponse("Defect id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        await prismadb.defect.delete({
            where: {
                id: params.defectId
            },
        });

        return NextResponse.json("Defect deleted");
    } catch (error) {
        console.log('[DEFECT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};