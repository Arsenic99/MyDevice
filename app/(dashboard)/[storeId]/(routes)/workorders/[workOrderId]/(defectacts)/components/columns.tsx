"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { WorkOrder } from "@prisma/client"

export type DefectActColumn = {
    id: string,
    workOrderId: string,
    workOrder: {
        equipmentId: string
    }
}

export const defectActColumns: ColumnDef<DefectActColumn>[] = [
    {
        accessorKey: "id",
        header: "Id",
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