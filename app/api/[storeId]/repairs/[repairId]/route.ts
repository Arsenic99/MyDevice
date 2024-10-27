import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { repairId: string } }
) {
    try {
        if (!params.repairId) {
            return new NextResponse("Repair id is required", { status: 400 });
        }

        const repair = await prismadb.repair.findUnique({
            where: {
                id: params.repairId
            },
        });

        return NextResponse.json(repair);
    } catch (error) {
        console.log('[REPAIR_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { repairId: string, storeId: string } }
) {
    try {

        if (!params.repairId) {
            return new NextResponse("Repair id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        await prismadb.repair.delete({
            where: {
                id: params.repairId
            },
        });

        return NextResponse.json("Repair deleted");
    } catch (error) {
        console.log('[REPAIR_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, repairId: string } }
) {
    try {
        const body = await req.json();

        const { repairactId, action, materials, tools } = body;

        if (!repairactId) {
            return new NextResponse("Repair id is required", { status: 400 });
        }

        if (!action) {
            return new NextResponse("Action is required", { status: 400 });
        }

        if (!materials) {
            return new NextResponse("Material is required", { status: 400 });
        }

        if (!tools) {
            return new NextResponse("Tools is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        await prismadb.repair.update({
            where: {
                id: params.repairId
            },
            data: {
                repairactId,
                action,
                materials,
                tools
            },
        });

        return NextResponse.json('Repair updated');
    } catch (error) {
        console.log('[REPAIR_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};