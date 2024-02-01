"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { EquipmentColumn, columns } from "./columns";

interface EquipmentsClientProps {
    data: EquipmentColumn[];
};

export const EquipmentsClient: React.FC<EquipmentsClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Equipments (${data.length})`} description="Manage equipments for your store" />
                <Button onClick={() => router.push(`/${params.storeId}/equipments/new`)}>
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API Calls for Equipments" />
            <Separator />
            <ApiList entityName="equipments" entityIdName="equipmentId" />
        </>
    );
};