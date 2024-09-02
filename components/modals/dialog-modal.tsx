"use client";

import { useEffect, useRef, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

interface DialogModalProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

export const DialogModal: React.FC<DialogModalProps> = ({
    isOpen,
    onClose,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>();
    const [name, setName] = useState<string>('');
    const [time, setTime] = useState<Boolean>(false);
    const [timeFrom, setTimeFrom] = useState<Date | null>();
    const [timeTo, setTimeTo] = useState<Date | null>();
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(()=>{
        setTimeFrom(null);
        setTimeTo(null);
    },[time])
    
    useEffect(()=>{
        setTime(false);
        setFile(null);
        setName('');
    },[onClose])

    if (!isMounted) {
        return null;
    }

    const equipmentId = typeof params.equipmentId === 'string' ? params.equipmentId : params.equipmentId[0];
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file || !name) return toast.error("Заполните ячейки");
        try {
            const data = new FormData()
            data.set('file', file)
            data.set('equipmentId', equipmentId)
            data.set('name', name)
            data.set('time', time.toString())
            data.set('timeFrom', (timeFrom || '').toString())
            data.set('timeTo', (timeTo || '').toString())

            if((timeFrom !== null && timeFrom !== undefined) && (timeTo !== null && timeTo !== undefined) && timeFrom > timeTo) {
                toast.error("Дата окончания не может раньше даты начала");
                return;
            }

            const res = await fetch(`/api/${params.storeId}/upload`, {
                method: 'POST',
                body: data
            })
            if (await res.text() === 'Name already exists') {
                toast.error("Такое наименование уже существует");
            }
            else {
                toast.success("Файл загружен");
                setFile(null);
                setName('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                router.refresh();
            }
            onClose()
        } catch (e: any) {
            console.error(e)
        }
    }


    return (
        <Modal
            title="Загрузить файл"
            description="Пожалуйста введите наименование и загрузите файл"
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={onSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className='mr-5 text-right'>Наименование</Label>
                        <Input type="text" name='name' className='border col-span-3' value={name} onChange={(e) => setName(e.target?.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className='mr-5 text-right'>Файл</Label>
                        <Input type="file" className="col-span-3" name='file' ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0])} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time1" className="mr-5 text-right" onClick={() => setTime(!time)}>Добавить срок действия</Label>
                        <Checkbox id="time1" onClick={() => setTime(!time)} />
                    </div>
                    {
                        time && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="from" className='mr-5 text-right'>Дата начала</Label>
                                    <Input type="date" name='from' className='border col-span-3' onChange={(e:any)=>setTimeFrom(e.target.value)} />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="to" className='mr-5 text-right'>Дата окончания</Label>
                                    <Input type="date" name='to' className='border col-span-3' onChange={(e:any)=>setTimeTo(e.target.value)} />
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="flex justify-end items-center">
                    <Button type='submit' disabled={loading}>
                        {
                            loading ? 'Загрузка...' : 'Загрузить'
                        }
                    </Button>
                </div>
            </form>
        </Modal>
    );
};