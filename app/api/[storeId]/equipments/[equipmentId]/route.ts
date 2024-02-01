import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { equipmentId: string } }
) {
    try {
        if (!params.equipmentId) {
            return new NextResponse("Equipment id is required", { status: 400 });
        }

        const equipment = await prismadb.equipment.findUnique({
            where: {
                id: params.equipmentId
            },
            include: {
                category: true,
            }
        });

        return NextResponse.json(equipment);
    } catch (error) {
        console.log('[EQUIPMENT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { equipmentId: string, storeId: string } }
) {
    try {

        if (!params.equipmentId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const equipment = await prismadb.equipment.delete({
            where: {
                id: params.equipmentId
            },
        });

        return NextResponse.json(equipment);
    } catch (error) {
        console.log('[EQUIPMENT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function PATCH(
    req: Request,
    { params }: { params: { equipmentId: string, storeId: string } }
) {
    try {
        const body = await req.json();

        const { name, categoryId, serialNumber, inventoryNumber } = body;

        if (!params.equipmentId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        await prismadb.equipment.update({
            where: {
                id: params.equipmentId
            },
            data: {
                name,
                categoryId,
                serialNumber,
                inventoryNumber
            },
        });

        const equipment = await prismadb.equipment.update({
            where: {
                id: params.equipmentId
            },
            data: {
            },
        })

        return NextResponse.json(equipment);
    } catch (error) {
        console.log('[EQUIPMENT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};