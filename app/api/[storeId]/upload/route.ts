import prismadb from '@/lib/prismadb'
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const equipmentId: string | null = data.get('equipmentId') as unknown as string
    const name: string | null = data.get('name') as unknown as string
    const time: string | null = data.get('time') as unknown as string
    const timeFrom: string | null = data.get('timeFrom') as unknown as string
    const timeTo: string | null = data.get('timeTo') as unknown as string

    if (!file) {
        return NextResponse.json({ success: false })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = file.name
    const extension = path.extname(fileName)
    const folderPath = `public/${equipmentId}`

    const fs = require('fs')
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
    }

    const filePath = `${folderPath}/${name}${extension}`

    const filesPath = `${name}${extension}`

    await writeFile(filePath, buffer)

    const existingName = await prismadb.file.findFirst({
        where:{
            fileName: name
        }
    })

    if (existingName && existingName?.equipmentId === equipmentId) {
        return new NextResponse("Name already exists");
    }

    await prismadb.file.create({
        data: {
            fileName: name,
            equipmentId,
            path: filesPath,
            time,
            timeFrom: timeFrom ? new Date(Date.parse(timeFrom)).toISOString().substring(0, 10) : '',
            timeTo: timeTo ? new Date(Date.parse(timeTo)).toISOString().substring(0, 10) : ''
        }
    })

    return new NextResponse("Fle uploaded");
}