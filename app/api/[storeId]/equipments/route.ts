import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { name, categoryId, serialNumber, inventoryNumber } = body;


        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const equipment = await prismadb.equipment.create({
            data: {
                name,
                categoryId,
                serialNumber,
                inventoryNumber,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(equipment);
    } catch (error) {
        console.log('[EQUIPMENTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined;

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const equipments = await prismadb.equipment.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(equipments);
    } catch (error) {
        console.log('[EQUIPMENTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};