import prismadb from "@/lib/prismadb";
import { RepairActForm } from "./components/repairact-form";

const RepairActIdPage = async ({
    params
}: {
    params: { repairActId: string }
}) => {

    const repairAct = await prismadb.repairAct.findUnique({
        where: {
            id: params.repairActId
        },
        include:{
            workOrder:{
                select:{
                    equipment:{
                        select:{
                            name: true,
                            id: true
                        }
                    },
                    name: true
                },
            },
            defectact:{
                select:{
                    defect:{
                        select:{
                            description:true
                        }
                    }
                }
            }
        }
    })

    const repairs = await prismadb.repair.findMany({
        where: {
            repairactId: repairAct?.id
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RepairActForm initialData={repairAct} repairs={repairs}/>
            </div>
        </div>
    )
}

export default RepairActIdPage;