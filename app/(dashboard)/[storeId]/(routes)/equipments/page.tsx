import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { EquipmentsClient } from "./components/client";
import { EquipmentColumn } from "./components/columns";

const EquipmentsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const products = await prismadb.equipment.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: {
                select: {
                    name: true,
                    location: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedEquipments: EquipmentColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        serialNumber: item.serialNumber || '',
        inventoryNumber: item.inventoryNumber || '',
        category: item.category.name,
        location: item.category.location.name,
    }));
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <EquipmentsClient data={formattedEquipments} />
            </div>
        </div>
    );
};

export default EquipmentsPage;