import prismadb from "@/lib/prismadb";
import { WorkOrdersClient } from "./components/client";
import { WorkOrderColumn } from "./components/columns";

const WorkOrdersPage = async ({
    searchParams
}: {
    searchParams: { equipmentId: string }
}) => {
    const workOrders = await prismadb.workOrder.findMany({
        where: {
            equipmentId: searchParams.equipmentId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const equipment = await prismadb.equipment.findUnique({
        where: {
            id: searchParams.equipmentId
        },
        select:{
            name: true
        }
    })

    const formattedEquipments: WorkOrderColumn[] = workOrders.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        startDate: item.startDate,
        finishDate: item.finishDate,
        equipmentId: item.equipmentId
    }));
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <WorkOrdersClient data={formattedEquipments} name={equipment}/>
            </div>
        </div>
    );
    };

export default WorkOrdersPage;