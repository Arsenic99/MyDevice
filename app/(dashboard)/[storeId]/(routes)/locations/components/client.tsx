"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { phrase } from "@/lib/lang";

import { columns, LocationColumn } from "./columns";

interface LocationClientProps {
    data: LocationColumn[];
}

export const LocationClient: React.FC<LocationClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Объекты (${data.length})`} description="Управляйте объектами вашей компании" />
                <Button onClick={() => router.push(`/${params.storeId}/locations/new`)}>
                    <Plus className="mr-2 h-4 w-4" /> {phrase.ADD_NEW.ru}
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API Calls for Locations" />
            <Separator />
            <ApiList entityName="locations" entityIdName="locationId" />
        </>
    );
};