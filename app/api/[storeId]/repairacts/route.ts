import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { workOrderId, defectactId } = body;


        if (!workOrderId) {
            return new NextResponse("Work Order Id is required", { status: 400 });
        }

        if (!defectactId) {
            return new NextResponse("Defect Act Id is required", { status: 400 });
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

        const repairAct = await prismadb.repairAct.create({
            data: {
                workOrderId,
                defectactId
            },
        });

        return NextResponse.json(repairAct);
    } catch (error) {
        console.log('[REPAIRACTS_POST]', error);
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

        const repairActs = await prismadb.repairAct.findMany({
            where: {
                workOrderId,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(repairActs);
    } catch (error) {
        console.log('[REPAIRACTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};