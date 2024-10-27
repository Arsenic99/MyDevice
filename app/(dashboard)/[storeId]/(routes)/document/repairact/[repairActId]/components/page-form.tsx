"use client"

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Repair } from "@prisma/client";
import { phrase } from "@/lib/lang";
import Image from "next/image";
import Logo from "@/public/kbg.jpg"
import { Button } from "@/components/ui/button";


export const PageForm = ({data}:any) => {

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef, documentTitle:`${phrase.REPAIR_ACT.ru}:${data.id}` });
    return (    
        <div className="flex-col">
            <div ref={contentRef} className="flex-1 space-y-4 p-8 pt-6">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="border" colSpan={4}>
                                <Image src={Logo} alt="KBG Logo" width={100}/>
                            </TableCell>
                            <TableCell colSpan={4} className="border">
                                {phrase.REPAIR_ACT.ru}: {data?.id}
                            </TableCell>
                            <TableCell colSpan={4} className="border">
                                {phrase.DEFECT_ACT.ru}: {data?.defectactId}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border" colSpan={4}>
                                Описание оборудования: {data?.workOrder?.equipment?.name}
                            </TableCell>
                            <TableCell className="border" colSpan={4}>
                                Серийный номер оборудования: {data?.workOrder?.equipment?.serialNumber}
                            </TableCell>
                            <TableCell className="border" colSpan={4}>
                                Инвентарный номер оборудования: {data?.workOrder?.equipment?.inventoryNumber}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border" colSpan={6}>
                                Описание заказ-наряда: {data?.workOrder?.name}
                            </TableCell>
                            <TableCell className="border" colSpan={6}>
                                Описание заказ-наряда: {data?.workOrder?.description}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border" colSpan={3}>
                                Описание дефекта
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                                Описание ремонтных работ
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                                Использованные материалы
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                                Задействованная техника
                            </TableCell>
                        </TableRow>
                        {
                            data?.repair.map((item:Repair) => (
                                <TableRow key={item.id}>
                                    <TableCell className="border whitespace-pre-line" colSpan={3}>{item.description}</TableCell>
                                    <TableCell className="border whitespace-pre-line" colSpan={3}>{item.action}</TableCell>
                                    <TableCell className="border whitespace-pre-line" colSpan={3}>{item.materials}</TableCell>
                                    <TableCell className="border whitespace-pre-line" colSpan={3}>{item.tools}</TableCell>
                                </TableRow>
                            ))
                        }
                        <TableRow>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                                Выполнил
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                                Одобрено
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                                Принял
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border" colSpan={3}>
                                Должность
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border" colSpan={3}>
                                Подпись
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border" colSpan={3}>
                                Расшифровка подписи
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border" colSpan={3}>
                                Дата
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                            <TableCell className="border" colSpan={3}>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Button onClick={()=>reactToPrintFn()} className=" right-8">Печать / Скачать</Button>
            </div>
        </div>
    )
}