"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { DefectAct } from "@prisma/client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface RepairModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    defectActs: DefectAct[];
    selected: string;
    setSelected: (selected:string) => void;
}

export const RepairModal: React.FC<RepairModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    defectActs,
    selected,
    setSelected
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title="Выберите дефектный акт"
            description="Пожалуйста выберите дефектный акт из списка"
            isOpen={isOpen}
            onClose={onClose}
        >
            <Select onValueChange={(value)=>setSelected(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите дефектный акт" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Дефектный акты</SelectLabel>
                        {
                            defectActs && defectActs.map((defectAct)=>(
                                <SelectItem value={defectAct.id} key={defectAct.id}>{defectAct.id}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm}>Continue</Button>
            </div>
        </Modal>
    );
};