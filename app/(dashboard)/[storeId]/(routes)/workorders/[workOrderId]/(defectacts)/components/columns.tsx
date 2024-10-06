"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type DefectActColumn = {
    id: string,
    workOrderId: string
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