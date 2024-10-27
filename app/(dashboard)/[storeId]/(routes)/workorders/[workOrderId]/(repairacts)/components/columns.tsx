"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type RepairActColumn = {
    id: string,
    workOrderId: string,
    workOrder: {
        equipmentId: string
    }
}

export const repairActColumns: ColumnDef<RepairActColumn>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "defectactId",
        header: "Дефектный акт",
    },
    {
        accessorKey: "createdAt",
        header: "Дата создания",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];