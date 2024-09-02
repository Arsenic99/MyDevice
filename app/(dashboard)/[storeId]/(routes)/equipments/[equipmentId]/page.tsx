import prismadb from "@/lib/prismadb";

import { EquipmentForm } from "./components/equipment-form";

const EquipmentPage = async ({
    params
}: {
    params: { equipmentId: string, storeId: string }
}) => {
    const equipment = await prismadb.equipment.findUnique({
        where: {
            id: params.equipmentId,
        }
    });
    
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            location: {
                select: {
                    name: true
                }
            }
        }
    });
    const events = await prismadb.event.findMany({
        where:{
            equipmentId: params.equipmentId
        }
    })
    const files = await prismadb.file.findMany({
        where:{
            equipmentId: params.equipmentId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <EquipmentForm
                    categories={categories}
                    initialData={equipment}
                    files={files}
                    events={events}
                />
            </div>
        </div>
    );
}

export default EquipmentPage;