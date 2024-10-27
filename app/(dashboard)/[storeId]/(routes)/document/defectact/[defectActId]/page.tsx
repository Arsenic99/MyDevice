import prismadb from "@/lib/prismadb";
import { PageForm } from "./components/page-form";

const DefectActPage = async({
    params
}:{
    params: { storeId: string, defectActId: string }
}) => {

    const data = await prismadb.defectAct.findUnique({
        where:{
            id: params.defectActId
        },
        include:{
            defect:true,
            workOrder:{
                include:{
                    equipment:true
                }
            }
        }
    })

    return(
        <div>
            <PageForm data = {data}/>
        </div>
    )
}

export default DefectActPage;