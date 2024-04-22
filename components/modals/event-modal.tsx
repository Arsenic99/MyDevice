"use client";

import { useEffect, useRef, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    onClose,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [title, setTitle] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('');
    const [interval, setInterval] = useState<string>('');
    const [startDay, setStartDay] = useState<Date | null>();
    const [endDay, setEndDay] = useState<Date | null>();
    const params = useParams();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const equipmentId = typeof params.equipmentId === 'string' ? params.equipmentId : params.equipmentId[0];
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title || !frequency || !startDay) return toast.error("Fill blanks");
        try {
            const data = new FormData()
            data.set('title', title)
            data.set('frequency', frequency)
            data.set('interval', interval)
            data.set('startDay', startDay.toString())
            data.set('endDay', (endDay || '').toString())
            data.set('equipmentId', equipmentId)
            await fetch(`/api/${params.storeId}/events`, {
                method: 'POST',
                body: data
            })
            onClose()
        } catch (e: any) {
            console.error(e)
        }
    }
    return (
        <Modal
            title="Add event"
            description="Please enter title, frequency, interval, start and end date"
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={onSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className='mr-5 mb-5 text-right'>Title</Label>
                        <Input type="text" name='title' className='border col-span-3' value={title} onChange={(e) => setTitle(e.target?.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="freq" className='mr-5 mb-5 text-right'>Frequency</Label>
                        <Select onValueChange={(value)=>setFrequency(value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="daily" onChange={()=>setFrequency('daily')}>Daily</SelectItem>
                                    <SelectItem value="weekly" onChange={()=>setFrequency('weekly')}>Weekly</SelectItem>
                                    <SelectItem value="monthly" onSelect={()=>setFrequency('monthly')}>Monthly</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="interval" className='mr-5 mb-5 text-right'>Interval</Label>
                        <Input type="text" name='interval' className='border col-span-3' value={interval} onChange={(e) => setInterval(e.target?.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dtstart" className='mr-5 mb-5 text-right'>Start day</Label>
                        <Input type="date" name='dtstart' className='border col-span-3' onChange={(e) => setStartDay(new Date(e.target?.value))} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="until" className='mr-5 mb-5 text-right'>End day</Label>
                        <Input type="date" name='until' className='border col-span-3' onChange={(e) => setEndDay(new Date(e.target?.value))} />
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