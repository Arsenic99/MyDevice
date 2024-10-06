import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { defectactId, description, reason, correctiveAction } = body;


        if (!defectactId) {
            return new NextResponse("Defect Act Id is required", { status: 400 });
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

        await prismadb.defect.create({
            data: {
                defectactId,
                description,
                reason,
                correctiveAction
            },
        });

        return NextResponse.json("Defect created");
    } catch (error) {
        console.log('[DEFECTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        const { searchParams } = new URL(req.url)
        const defectactId = searchParams.get('defectActId') || undefined;

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const defects = await prismadb.defect.findMany({
            where: {
                defectactId,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(defects);
    } catch (error) {
        console.log('[DEFECTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};