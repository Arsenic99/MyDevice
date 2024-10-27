"use client"

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Defect } from "@prisma/client";
import { phrase } from "@/lib/lang";
import Image from "next/image";
import Logo from "@/public/kbg.jpg"
import { Button } from "@/components/ui/button";


export const PageForm = ({data}:any) => {

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef, documentTitle:`${phrase.DEFECT_ACT.ru}:${data.id}` });

    return (    
        <div className="flex-col">
            <div ref={contentRef} className="flex-1 space-y-4 p-8 pt-6">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="border" colSpan={4}>
                                <Image src={Logo} alt="KBG Logo" width={100}/>
                            </TableCell>
                            <TableCell colSpan={8} className="border">
                                {phrase.DEFECT_ACT.ru}: {data?.id}
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
                            <TableCell className="border" colSpan={4}>
                                Описание дефекта
                            </TableCell>
                            <TableCell className="border" colSpan={4}>
                                Причина возникшего дефекта
                            </TableCell>
                            <TableCell className="border" colSpan={4}>
                                Мероприятие по устранению дефекта
                            </TableCell>
                        </TableRow>
                        {
                            data?.defect.map((item:Defect) => (
                                <TableRow key={item.id}>
                                    <TableCell className="border whitespace-pre-line" colSpan={4}>{item.description}</TableCell>
                                    <TableCell className="border whitespace-pre-line" colSpan={4}>{item.reason}</TableCell>
                                    <TableCell className="border whitespace-pre-line" colSpan={4}>{item.correctiveAction}</TableCell>
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
                <Button onClick={()=>reactToPrintFn()}>Печать / Скачать</Button>
            </div>
        </div>
    )
}