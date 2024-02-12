import prismadb from '@/lib/prismadb'
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const equipmentId: string | null = data.get('equipmentId') as unknown as string
    const name: string | null = data.get('name') as unknown as string

    if (!file) {
        return NextResponse.json({ success: false })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extract file name and create folder path
    const fileName = file.name
    const extension = path.extname(fileName)
    const folderPath = `public/${equipmentId}`

    // Ensure the folder exists
    const fs = require('fs')
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
    }

    // Set the path to save the file inside the folder
    const filePath = `${folderPath}/${name}${extension}`

    // Write the file to the folder
    await writeFile(filePath, buffer)
    console.log(`Open /${filePath} to see the uploaded file`)

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
            path: filePath
        }
    })

    return new NextResponse("Fle uploaded");
}

export async function GET(request: NextRequest, {params}:{params:{storeId: string}}) {
    try {
        if (!params.storeId) {
            return new NextResponse("Equipment id is required", { status: 400 });
        }

        const files = await prismadb.file.findMany({
            
        });

        return NextResponse.json(files);
    } catch (error) {
        console.log('[FILES_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}