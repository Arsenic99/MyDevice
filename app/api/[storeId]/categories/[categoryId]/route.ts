import { NextResponse } from "next/server";

import {DELETE as DELETEEQUIPMENT} from '../../equipments/[equipmentId]/route'

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId
            },
            include: {
                location: true
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { categoryId: string, storeId: string } }
) {
    try {

        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const equipments = await prismadb.equipment.findMany({
            where:{
                categoryId: params.categoryId
            }
        })

        const equipmentIds = equipments.map(equipment=>equipment.id)

        for (const equipmentId of equipmentIds) {
            await DELETEEQUIPMENT(req, { params: { equipmentId, storeId: params.storeId } });
        }

        const category = await prismadb.category.delete({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function PATCH(
    req: Request,
    { params }: { params: { categoryId: string, storeId: string } }
) {
    try {

        const body = await req.json();

        const { name, locationId } = body;


        if (!locationId) {
            return new NextResponse("Location ID is required", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const category = await prismadb.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                locationId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};