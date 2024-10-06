import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { name, description, startDate, finishDate, equipmentId} = body;


        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!description) {
            return new NextResponse("Description is required", { status: 400 });
        }

        if (!equipmentId) {
            return new NextResponse("Equipment id is required", { status: 400 });
        }

        if (!startDate) {
            return new NextResponse("Start date is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        await prismadb.workOrder.create({
            data: {
                name,
                description,
                startDate,
                finishDate: finishDate ? finishDate : '',
                equipmentId: equipmentId,
            },
        });

        return NextResponse.json('Work Order successfully created');
    } catch (error) {
        console.log('[EQUIPMENTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};