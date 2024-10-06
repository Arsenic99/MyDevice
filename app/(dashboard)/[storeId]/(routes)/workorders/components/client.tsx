"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { WorkOrderColumn, columns } from "./columns";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface WorkOrdersClientProps {
    data: WorkOrderColumn[];
    name: NameProps | null
};

interface NameProps {
    name: string;
}

export const WorkOrdersClient: React.FC<WorkOrdersClientProps> = ({
    data,
    name
}) => {
    const params = useParams();
    const equipmentId = useSearchParams().get('equipmentId')
    const router = useRouter();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Заказ-наряды (${data.length})`} description="Управляйте заказ-нарядами вашей компании" />
                <Button onClick={() => router.push(`/${params.storeId}/workorders/new?equipmentId=${equipmentId}`)}>
                    <Plus className="mr-2 h-4 w-4" /> Добавить новый
                </Button>
            </div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${params.storeId}/equipments`}>Оборудования</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${params.storeId}/equipments/${equipmentId}`}>{name?.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Заказ-наряды</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API Calls for Work Orders" />
            <Separator />
            <ApiList entityName="workorders" entityIdName="workorderId" />
        </>
    );
};