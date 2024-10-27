import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { maintenanceActId: string } }
) {
    try {
        if (!params.maintenanceActId) {
            return new NextResponse("Maintenance Act id is required", { status: 400 });
        }

        const maintenanceAct = await prismadb.maintenanceAct.findUnique({
            where: {
                id: params.maintenanceActId
            },
        });

        return NextResponse.json(maintenanceAct);
    } catch (error) {
        console.log('[MAINTENANCEACT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { maintenanceActId: string, storeId: string } }
) {
    try {

        if (!params.maintenanceActId) {
            return new NextResponse("Maintenance Act id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        await prismadb.maintenanceAct.delete({
            where: {
                id: params.maintenanceActId
            },
        });

        return NextResponse.json("Maintenance Act deleted");
    } catch (error) {
        console.log('[MAINTENANCEACT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};