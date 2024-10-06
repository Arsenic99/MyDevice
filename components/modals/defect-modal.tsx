"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface DefectModalProps {
    isOpen: boolean;
    onClose: (setDefect:any) => void;
    onConfirm: (defect: any, setDefect:any) => void;
    loading: boolean;
}

export const DefectModal: React.FC<DefectModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [defect, setDefect] = useState({
        description: '',
        reason: '',
        correctiveAction: ''
    })

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <Modal
            title="Добавьте дефект"
            description="Укажите описание, причину и корректирующие меры"
            isOpen={isOpen}
            onClose={()=>onClose(setDefect)}
        >
            <div className="flex flex-col gap-3">
                <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea id="description" className="mb-3" value={defect.description} onChange={(e) => { setDefect((prev) => ({ ...prev, description: e.target.value })) }} />
                    <Label htmlFor="reason">Причина</Label>
                    <Input id="reason" className="mb-3" value={defect.reason} onChange={(e) => { setDefect((prev) => ({ ...prev, reason: e.target.value })) }} />
                    <Label htmlFor="correctiveAction">Корректирующие меры</Label>
                    <Input id="correctiveAction" value={defect.correctiveAction} onChange={(e) => { setDefect((prev) => ({ ...prev, correctiveAction: e.target.value })) }} />
                </div>
                <div>
                    <Button onClick={() => onConfirm(defect, setDefect)}>
                        Добавить
                    </Button>
                </div>
            </div>
        </Modal>
    );
};