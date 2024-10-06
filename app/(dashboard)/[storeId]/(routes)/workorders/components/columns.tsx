"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CaretSortIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button";
import { CellAction } from "./cell-action";

export type WorkOrderColumn = {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    finishDate: Date;
    equipmentId: string;
}

export const columns: ColumnDef<WorkOrderColumn>[] = [
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
        accessorKey: "description",
        header: "Описание",
    },
    {
        accessorKey: "startDate",
        header: "Дата начала",
    },
    {
        accessorKey: "finishDate",
        header: "Дата окончания",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];