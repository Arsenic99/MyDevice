import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { workOrderId } = body;


        if (!workOrderId) {
            return new NextResponse("Work Order Id is required", { status: 400 });
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

        const defectAct = await prismadb.defectAct.create({
            data: {
                workOrderId
            },
        });

        return NextResponse.json(defectAct);
    } catch (error) {
        console.log('[DEFECTACTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        const { searchParams } = new URL(req.url)
        const workOrderId = searchParams.get('workOrderId') || undefined;

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const defectActs = await prismadb.defectAct.findMany({
            where: {
                workOrderId,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(defectActs);
    } catch (error) {
        console.log('[DEFECTACTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};