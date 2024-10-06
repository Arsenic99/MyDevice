"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
    onConfirm: (event: any) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    onClose,
    loading,
    onConfirm
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [event, setEvent] = useState({
        title: '',
        frequency: '',
        interval: '',
        startDay: new Date(),
        endDay: new Date(8.64e15)
    })
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (!event.title || !event.frequency || !event.startDay) return toast.error("Fill blanks");
        try {
            onConfirm(event);
        } catch (e: any) {
            console.error(e)
        }
    }
    return (
        <Modal
            title="Добавить ТО"
            description="Пожалуйста введите наименование, период, частоту, начальную и конечную дату."
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={onSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className='text-right'>Наименование</Label>
                        <Input type="text" id='title' className='border col-span-3' value={event.title} onChange={(e) => setEvent((prev)=>({...prev, title:e.target?.value}))} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="freq" className='text-right'>Период</Label>
                        <Select onValueChange={(value)=>setEvent((prev)=>({...prev, frequency:value}))}>
                            <SelectTrigger id="freq" className="col-span-3">
                                <SelectValue placeholder="Выберите период" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="daily">Ежедневно</SelectItem>
                                    <SelectItem value="weekly">Еженедельно</SelectItem>
                                    <SelectItem value="monthly">Ежемесячно</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="interval" className='text-right'>Частота</Label>
                        <Input type="text" name='interval' id="interval" className='border col-span-3' value={event.interval} onChange={(e) => setEvent((prev)=>({...prev, interval: e.target?.value}))} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dtstart" className='text-right'>Дата начала</Label>
                        <Input type="date" name='dtstart' id="dtstart" className='border col-span-3' onChange={(e) => setEvent((prev)=>({...prev, startDay: new Date(e.target?.value)}))} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="until" className='text-right'>Дата окончания</Label>
                        <Input type="date" name='until' id="until" className='border col-span-3' onChange={(e) => setEvent((prev)=>({...prev, endDay: new Date(e.target?.value)}))} />
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <Button type='submit' disabled={loading}>
                        {
                            loading ? 'Loading' : 'Add'
                        }
                    </Button>
                </div>
            </form>
        </Modal>
    );
};