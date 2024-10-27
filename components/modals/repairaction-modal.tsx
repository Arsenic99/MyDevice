"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface RepairModalProps {
    isOpen: boolean;
    onClose: (setRepair: any) => void;
    onConfirm: (repair: any, setRepair: any) => void;
    loading: boolean;
    defects: any;
}

export const RepairModal: React.FC<RepairModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    defects,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [repair, setRepair] = useState({
        defect: '',
        action: '',
        materials: '',
        tools: ''
    })
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <Modal
            title="Добавьте ремонтную работу"
            description="Укажите выполненную работу, использованные материалы, инструменты и технику"
            isOpen={isOpen}
            onClose={() => onClose(setRepair)}
        >
            <div className="flex flex-col gap-3">
                <div>
                    <Label>Дефект</Label>
                    <Select onValueChange={(value) => setRepair((prev)=>({...prev, defect: value}))}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите дефект" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    defects && defects.map((defect:any) => (
                                        <SelectItem value={defect.description} key={defect.description}>{defect.description}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Label htmlFor="description">Выполненная работа</Label>
                    <Textarea id="description" className="mb-3" value={repair.action} onChange={(e) => { setRepair((prev) => ({ ...prev, action: e.target.value })) }} />
                    <Label htmlFor="reason">Материалы</Label>
                    <Textarea id="reason" className="mb-3" value={repair.materials} onChange={(e) => { setRepair((prev) => ({ ...prev, materials: e.target.value })) }} />
                    <Label htmlFor="correctiveAction">Инструменты и техника</Label>
                    <Textarea id="correctiveAction" value={repair.tools} onChange={(e) => { setRepair((prev) => ({ ...prev, tools: e.target.value })) }} />
                </div>
                <div>
                    <Button onClick={() => onConfirm(repair, setRepair)}>
                        Добавить
                    </Button>
                </div>
            </div>
        </Modal>
    );
};