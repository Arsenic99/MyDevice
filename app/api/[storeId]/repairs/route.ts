import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { description, repairactId, action, materials, tools } = body;


        if (!description) {
            return new NextResponse("Description is required", { status: 400 });
        }

        if (!repairactId) {
            return new NextResponse("Repair Act Id is required", { status: 400 });
        }

        if (!action) {
            return new NextResponse("Action is required", { status: 400 });
        }
        
        if (!materials) {
            return new NextResponse("Materials is required", { status: 400 });
        }
        
        if (!tools) {
            return new NextResponse("Tools is required", { status: 400 });
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

        await prismadb.repair.create({
            data: {
                description,
                repairactId,
                action,
                materials,
                tools
            },
        });

        return NextResponse.json("Repair created");
    } catch (error) {
        console.log('[REPAIRS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        const { searchParams } = new URL(req.url)
        const repairactId = searchParams.get('repairActId') || undefined;

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const repairs = await prismadb.repair.findMany({
            where: {
                repairactId,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(repairs);
    } catch (error) {
        console.log('[REPAIRS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};