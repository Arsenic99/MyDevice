"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type DefectColumn = {
    id: string,
    description: string,
    reason: string,
    correctiveAction: string
}

export const defectColumns: ColumnDef<DefectColumn>[] = [
    {
        accessorKey: "description",
        header: "Описание",
    },
    {
        accessorKey: "reason",
        header: "Причина",
    },
    {
        accessorKey: "correctiveAction",
        header: "Меры по устранению",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];