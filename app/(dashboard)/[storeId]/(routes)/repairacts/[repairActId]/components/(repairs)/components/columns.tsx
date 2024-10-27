"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type RepairColumn = {
    id: string,
    action: string,
    materials: string,
    tools: string,
    description: string,
}

export const repairColumns: ColumnDef<RepairColumn>[] = [
    {
        accessorKey: "description",
        header: "Описание дефекта",
    },
    {
        accessorKey: "action",
        header: "Выполненная работа",
    },
    {
        accessorKey: "materials",
        header: "Использованные материалы",
    },
    {
        accessorKey: "tools",
        header: "Использованные оборудование/техника",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];