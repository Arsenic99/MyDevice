import { NextResponse } from "next/server";
import { unlink, rm } from 'fs/promises'
import prismadb from "@/lib/prismadb";

export async function DELETE(request: Request, {params} : {params : {storeId:string, equipmentId:string, fileId: string, fileName: string}}) {
    try{
        if (!params.equipmentId) {
            return new NextResponse("Equipment id is required", { status: 400 });
        }

        if (!params.fileId) {
            return new NextResponse("File id is required", { status: 400 });
        }

        const folderPath = `public/${params.equipmentId}`
        const filePath = `${folderPath}/${params.fileName}`

        await unlink(filePath)

        await prismadb.file.delete({
            where:{
                equipmentId: params.equipmentId,
                id: params.fileId
            }
        })
        const fs = require('fs')
        const filesInFolder = fs.readdirSync(folderPath)
        if (filesInFolder.length === 0) {
            await rm(folderPath, { recursive: true, force: true })
        }

        return NextResponse.json("Successfully deleted");
    } catch (error) {
        console.log('[FILE_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}