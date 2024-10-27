"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type MaintenanceActColumn = {
    id: string,
    workOrderId: string,
    workOrder: {
        equipmentId: string
    }
}

export const maintenanceActColumns: ColumnDef<MaintenanceActColumn>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "workOrderId",
        header: "Акт ТО",
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