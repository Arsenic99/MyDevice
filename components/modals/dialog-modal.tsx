"use client";

import { useEffect, useRef, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

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
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const equipmentId = typeof params.equipmentId === 'string' ? params.equipmentId : params.equipmentId[0];
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file || !name) return toast.error("Fill blanks");
        try {
            const data = new FormData()
            data.set('file', file)
            data.set('equipmentId', equipmentId)
            data.set('name', name)
            const res = await fetch(`/api/${params.storeId}/upload`, {
                method: 'POST',
                body: data
            })
            if (await res.text() === 'Name already exists') {
                toast.error("Name already exists");
            }
            else {
                toast.success("Fle uploaded");
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
            title="Upload file"
            description="Please enter name and file"
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={onSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className='mr-5 mb-5 text-right'>Name</Label>
                        <Input type="text" name='name' className='border col-span-3' value={name} onChange={(e) => setName(e.target?.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className='mr-5 text-right'>File</Label>
                        <Input type="file" className="col-span-3" name='file' ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0])} />
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <Button type='submit' disabled={loading}>
                        {
                            loading ? 'Uploading' : 'Upload'
                        }
                    </Button>
                </div>
            </form>
        </Modal>
    );
};