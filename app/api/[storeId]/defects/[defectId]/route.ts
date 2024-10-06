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

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, defectId: string } }
) {
    try {
        const body = await req.json();

        const { defectactId, description, reason, correctiveAction } = body;

        if (!defectactId) {
            return new NextResponse("Defect id is required", { status: 400 });
        }

        if (!description) {
            return new NextResponse("Description is required", { status: 400 });
        }

        if (!reason) {
            return new NextResponse("Reason is required", { status: 400 });
        }

        if (!correctiveAction) {
            return new NextResponse("Corrective action is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        await prismadb.defect.update({
            where: {
                id: params.defectId
            },
            data: {
                defectactId,
                description,
                reason,
                correctiveAction
            },
        });

        return NextResponse.json('Defect updated');
    } catch (error) {
        console.log('[DEFECT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};