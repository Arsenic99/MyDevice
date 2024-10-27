"use client"

import axios from "axios"
import { useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Repair, RepairAct } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { repairColumns } from "./(repairs)/components/columns"
import { DataTable } from "@/components/ui/data-table"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { RepairModal } from "@/components/modals/repairaction-modal"

interface RepairActFormProps {
    initialData: RepairAct & {workOrder:{equipment:{name:string, id:string}}&{name:string}} & {defectact:{defect:{description:string}[]}} | null;
    repairs: Repair[];
};

export const RepairActForm: React.FC<RepairActFormProps> = ({
    initialData,
    repairs,
}) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [openRepair, setOpenRepair] = useState(false)
    const [loading, setLoading] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef } );

    const handlePrint = () => {
        router.push(`/${params.storeId}/document/repairact/${initialData?.id}`)
    };
    console.log(initialData)
    const title = 'Акт ремонтных работы';
    const description = '';

    const onConfirm = async(repair:any, setRepair:any) => {
        try {
            if(repair.defect.trim() == '' || repair.action.trim() == '' || repair.materials.trim() == '' || repair.tools.trim() == '') throw Error;
            axios.post(`/api/${params.storeId}/repairs`, {
                description: repair.defect,
                repairactId: params.repairActId,
                action: repair.action,
                materials: repair.materials,
                tools: repair.tools
            })
            router.refresh();
            toast.success('Ремонт создан.');
            router.refresh();
            setRepair((prev:Repair)=>({
                ...prev,
                action: '',
                materials: '',
                tools: ''
            }))
            router.refresh();
            setOpenRepair(false);
        } catch (error) {
            toast.error("Прошу заполните все поля!")
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/repairacts/${params.repairActId}`);
            router.push(`/${params.storeId}/workorders/${initialData?.workOrderId}?equipmentId=${initialData?.workOrder.equipment.id}`);
            router.refresh();
            toast.success('Repair Act deleted.');
        } catch (error: any) {
            toast.error('Make sure you removed all products using this Repair Act first.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const onRepairModalClose = (setRepair:any) =>{
        setOpenRepair(false)
        setRepair((prev:Repair)=>({
            ...prev,
            action: '',
            materials: '',
            tools: ''
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
            <RepairModal
                isOpen={openRepair}
                onClose={(setRepair)=>{onRepairModalClose(setRepair)}}
                onConfirm={(repair, setRepair)=>onConfirm(repair, setRepair)}
                loading={loading}
                defects={initialData?.defectact?.defect}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && <div className="flex items-center gap-2">
                    <Button 
                        size='sm'
                        onClick={handlePrint}
                    >
                        Скачать акт ремонтных работ
                    </Button>
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
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
                        <BreadcrumbPage>Акт ремонтных работ</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            }
            <Separator />
            <div>
                <span>ID</span>
                <p>{initialData?.id}</p>
            </div>
            <div ref={contentRef} className="flex justify-between items-center">
                <Heading title={'Ремонтные работы'} description={description} />
                <Button onClick={()=>setOpenRepair(true)}>Добавить</Button>
            </div>
            <DataTable searchKey="action" columns={repairColumns} data={repairs} />
            <Separator />
        </>
    );
};