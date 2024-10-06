import prismadb from "@/lib/prismadb";
import { WorkOrderForm } from "./components/workorder-form";

const WorkOrderPage = async ({
    params
}: {
    params: { equipmentId: string, storeId: string, workOrderId: string }
}) => {
    const workOrder = await prismadb.workOrder.findUnique({
        where: {
            id: params.workOrderId
        },
        include:{
            equipment:{
                select: {
                    name:true
                }
            }
        }
    });

    const defectActs = await prismadb.defectAct.findMany({
        where: {
            workOrderId: workOrder?.id
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <WorkOrderForm initialData={workOrder} defectActs={defectActs} />
            </div>
        </div>
    );
}

export default WorkOrderPage;