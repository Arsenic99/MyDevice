"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Button } from "@/components/ui/button"
import { CaretSortIcon } from "@radix-ui/react-icons"

export type CategoryColumn = {
    id: string
    name: string;
    locationLabel: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
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
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => row.original.locationLabel,
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];