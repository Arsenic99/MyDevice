import prismadb from "@/lib/prismadb";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const serialNumber = url.searchParams.get('serialNumber') ?? '';

        if (!serialNumber) {
            return new NextResponse("Serial number is required", { status: 400 });
        }

        const equipment = await prismadb.equipment.findMany({
            where: {
                serialNumber: serialNumber.toString()
            }
        });

        return NextResponse.json(equipment);
    } catch (error) {
        console.log('[EQUIPMENT_SERIALNUMBER_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
