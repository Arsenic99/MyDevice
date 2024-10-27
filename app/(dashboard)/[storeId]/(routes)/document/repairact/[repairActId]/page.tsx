import prismadb from "@/lib/prismadb";
import { PageForm } from "./components/page-form";

const RepairActPage = async({
    params
}:{
    params: {storeId: string, repairActId: string}
}) => {

    const data = await prismadb.repairAct.findUnique({
        where:{
            id: params.repairActId
        },
        include:{
            repair:true,
            workOrder:{
                include:{
                    equipment:true
                }
            }
        }
    })

    return(
        <div >
            <PageForm data = {data}/>
        </div>
    )
}

export default RepairActPage;