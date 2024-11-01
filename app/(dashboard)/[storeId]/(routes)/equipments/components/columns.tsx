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
        header: "Серийный номер",
    },
    {
        accessorKey: "inventoryNumber",
        header: "Инвентарный номер",
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
                    Наименование
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "category",
        header: "Категория",
    },
    {
        accessorKey: "location",
        header: "Объект",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];