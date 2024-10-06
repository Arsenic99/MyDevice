import prismadb from "@/lib/prismadb";
import { DefectActForm } from "./components/defectact-form";

const DefectActIdPage = async ({
    params
}: {
    params: { defectActId: string }
}) => {

    const defectAct = await prismadb.defectAct.findUnique({
        where: {
            id: params.defectActId
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
            }
        }
    })

    const defects = await prismadb.defect.findMany({
        where: {
            defectactId: defectAct?.id
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <DefectActForm initialData={defectAct} defects={defects}/>
            </div>
        </div>
    )
}

export default DefectActIdPage;