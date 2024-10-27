import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import {DELETE as DELETEREPAIRACTS} from "../../repairacts/[repairActId]/route"

export async function GET(
    req: Request,
    { params }: { params: { defectActId: string } }
) {
    try {
        if (!params.defectActId) {
            return new NextResponse("Defect Act id is required", { status: 400 });
        }

        const defectAct = await prismadb.defectAct.findUnique({
            where: {
                id: params.defectActId
            },
        });

        return NextResponse.json(defectAct);
    } catch (error) {
        console.log('[DEFECTACT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { defectActId: string, storeId: string } }
) {
    try {

        if (!params.defectActId) {
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

        const repairacts = await prismadb.repairAct.findMany({
            where:{
                defectactId: params.defectActId
            }
        })

        const repairactsIds = repairacts.map(repairacts => repairacts.id)

        for(const repairactsId of repairactsIds){
            await DELETEREPAIRACTS(req, { params: { repairActId: repairactsId, storeId: params.storeId } } )
        }

        await prismadb.defect.deleteMany({
            where:{
                defectactId:params.defectActId
            }
        })

        await prismadb.defectAct.delete({
            where: {
                id: params.defectActId
            },
        });

        return NextResponse.json("Defect Act deleted");
    } catch (error) {
        console.log('[DEFECTACT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};