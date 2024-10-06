import { NextRequest, NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(
    request: NextRequest,
    { params }: { params: { storeId: string } }
) {
    try {
        const data = await request.formData();

        const title = data.get('title') as unknown as string;
        const freq = data.get('frequency') as unknown as string;
        const interval = data.get('interval') as unknown as string;
        const startDay = data.get('startDay') as unknown as string;
        const endDay = data.get('endDay') as unknown as string;
        const equipmentId: string | null = data.get('equipmentId') as unknown as string

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        if (!freq) {
            return new NextResponse("Frequency is required", { status: 400 });
        }

        if (!startDay) {
            return new NextResponse("Start day is required", { status: 400 });
        }

        if (!equipmentId) {
            return new NextResponse("Equipment id is required", { status: 400 });
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
        const event = await prismadb.event.create({
            data: {
                title,
                equipmentId
            },
        });

        await prismadb.recurrenceRule.create({
            data: {
                eventId: event.id,
                freq: freq ? freq : 'daily',
                interval: Number(interval) ? Number(interval) : 1,
                dtstart: new Date(Date.parse(startDay)).toISOString().substring(0, 10),
                until: new Date(Date.parse(endDay)).toISOString().substring(0, 10),
            }
        })

        return NextResponse.json(event);
    } catch (error) {
        console.log('[EVENTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const events = await prismadb.event.findMany({
            select:{
                id: true,
                title: true,
                equipmentId: true
            }
        });

        for (let item of events) {
            const rrule = await prismadb.recurrenceRule.findFirst({
                where: {
                    eventId: item.id
                },
                select: {
                    freq: true,
                    interval: true,
                    dtstart: true,
                    until: true
                }
            });
            Object.assign(item, { rrule });
        }
        return NextResponse.json(events);
    } catch (error) {
        console.log('[EVENTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};