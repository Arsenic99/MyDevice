"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Button } from "@/components/ui/button"
import { CaretSortIcon } from "@radix-ui/react-icons"

export type LocationColumn = {
    id: string
    name: string;
}

export const columns: ColumnDef<LocationColumn>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    size={"noPadding"}
                >
                    Наименование
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "responsiblePerson",
        header: "Ответственное лицо",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];