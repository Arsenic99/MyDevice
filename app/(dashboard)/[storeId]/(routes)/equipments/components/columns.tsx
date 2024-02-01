"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CaretSortIcon } from "@radix-ui/react-icons"

import { CellAction } from "./cell-action"
import { Button } from "@/components/ui/button";

export type EquipmentColumn = {
    id: string;
    serialNumber: string;
    inventoryNumber: string;
    name: string;
    category: string;
    location: string;
}

export const columns: ColumnDef<EquipmentColumn>[] = [
    {
        accessorKey: "serialNumber",
        header: "Serial number",
    },
    {
        accessorKey: "inventoryNumber",
        header: "Inventory number",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    size={'noPadding'}
                >
                    Name
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];