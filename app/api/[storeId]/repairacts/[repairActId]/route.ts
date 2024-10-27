import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { repairActId: string } }
) {
    try {
        if (!params.repairActId) {
            return new NextResponse("Repair Act id is required", { status: 400 });
        }

        const repairAct = await prismadb.repairAct.findUnique({
            where: {
                id: params.repairActId
            },
            include:{
                repair: true,
                workOrder: {
                    include:{
                        equipment:true
                    },
                }
            }
        });

        return NextResponse.json(repairAct);
    } catch (error) {
        console.log('[REPAIRACT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { repairActId: string, storeId: string } }
) {
    try {

        if (!params.repairActId) {
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

        await prismadb.repair.deleteMany({
            where:{
                repairactId:params.repairActId
            }
        })

        await prismadb.repairAct.delete({
            where: {
                id: params.repairActId
            },
        });

        return NextResponse.json("Repair Act deleted");
    } catch (error) {
        console.log('[REPAIRACT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};