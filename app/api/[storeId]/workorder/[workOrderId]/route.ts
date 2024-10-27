import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { equipmentId: string, workorderId: string } }
) {
    try {
        if (!params.equipmentId) {
            return new NextResponse("Equipment id is required", { status: 400 });
        }

        if (!params.workorderId) {
            return new NextResponse("Work order id is required", { status: 400 });
        }

        const workOrder = await prismadb.workOrder.findUnique({
            where: {
                id: params.workorderId,
                equipmentId: params.equipmentId
            },
        });

        return NextResponse.json(workOrder);
    } catch (error) {
        console.log('[WORKORDER_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { equipmentId: string, storeId: string, workOrderId: string } }
) {
    try {
        
        await prismadb.maintenanceAct.deleteMany({
            where:{
                workOrderId: params.workOrderId
            }
        })

        await prismadb.repairAct.deleteMany({
            where:{
                workOrderId: params.workOrderId
            }
        })

        await prismadb.defectAct.deleteMany({
            where:{
                workOrderId: params.workOrderId
            }
        })

        await prismadb.workOrder.delete({
            where: {
                id: params.workOrderId
            },
        });

        return NextResponse.json('Work order deleted');
    } catch (error) {
        console.log('[WORKORDER_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function PATCH(
    req: Request,
    { params }: { params: { equipmentId: string, storeId: string, workOrderId: string } }
) {
    try {
        const body = await req.json();

        const { name, description, startDate, finishDate } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!description) {
            return new NextResponse("Description is required", { status: 400 });
        }

        if (!startDate) {
            return new NextResponse("Start date is required", { status: 400 });
        }

        await prismadb.workOrder.update({
            where: {
                id: params.workOrderId
            },
            data: {
                name,
                description,
                startDate,
                finishDate
            },
        });

        return NextResponse.json('Work order updated');
    } catch (error) {
        console.log('[WORKORDER_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};