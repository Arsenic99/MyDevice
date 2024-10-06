"use client"

import axios from "axios"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Defect, DefectAct } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { defectColumns } from "./(defects)/components/columns"
import { DataTable } from "@/components/ui/data-table"
import { DefectModal } from "@/components/modals/defect-modal"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface DefectActFormProps {
    initialData: DefectAct & {workOrder:{equipment:{name:string, id:string}}&{name:string}} | null;
    defects: Defect[];
};

export const DefectActForm: React.FC<DefectActFormProps> = ({
    initialData,
    defects
}) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [openDefect, setOpenDefect] = useState(false)
    const [loading, setLoading] = useState(false);

    const title = 'Дефектный акт';
    const description = '';

    const onConfirm = async(defect:Defect, setDefect:any) => {
        try {
            axios.post(`/api/${params.storeId}/defects`, {
                description: defect.description,
                reason: defect.reason,
                correctiveAction: defect.correctiveAction,
                defectactId: params.defectActId
            })
            toast.success('Дефект создан.');
            setDefect((prev:Defect)=>({
                ...prev,
                description: '',
                reason: '',
                correctiveAction: ''
            }))
            setOpenDefect(false);
            router.refresh();
        } catch (error) {
            console.log(error)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/defectacts/${params.defectActId}`);
            router.push(`/${params.storeId}/DefectActs`);
            router.refresh();
            toast.success('Work order deleted.');
        } catch (error: any) {
            toast.error('Make sure you removed all products using this Defect Act first.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const onDefectModalClose = (setDefect:any) =>{
        setOpenDefect(false)
        setDefect((prev:Defect)=>({
            ...prev,
            description: '',
            reason: '',
            correctiveAction: ''
        }))
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DefectModal
                isOpen={openDefect}
                onClose={(setDefect)=>{onDefectModalClose(setDefect)}}
                onConfirm={(defect, setDefect)=>onConfirm(defect, setDefect)}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData &&
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                }
            </div>
            {
                initialData && <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${params.storeId}/equipments`}>Оборудования</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${params.storeId}/equipments/${initialData?.workOrder?.equipment?.id}`}>{initialData?.workOrder?.equipment?.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${params.storeId}/workorders?equipmentId=${initialData?.workOrder?.equipment?.id}`}>Заказ-наряд</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${params.storeId}/workorders/${initialData.workOrderId}?equipmentId=${initialData?.workOrder?.equipment?.id}`}>{initialData?.workOrder?.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Дефектный акт</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            }
            <Separator />
            <div>
                <span>ID</span>
                <p>{initialData?.id}</p>
            </div>
            <div className="flex justify-between items-center">
                <Heading title={'Дефекты'} description={description} />
                <Button onClick={()=>setOpenDefect(true)}>Добавить дефект</Button>
            </div>
            <DataTable searchKey="description" columns={defectColumns} data={defects} />
            <Separator />
        </>
    );
};