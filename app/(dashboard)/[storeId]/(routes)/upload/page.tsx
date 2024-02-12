"use client"

import { useRef, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { GetServerSideProps } from 'next';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';


const UploadPage = () => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>();
    const [equipmentId, setEquipmentId] = useState<string>('');
    const [name, setName] = useState<string>('');

    const params = useParams();
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file || !name || !equipmentId) return toast.error("Fill blanks");
        setUploading(true)
        try {
            const data = new FormData()
            data.set('file', file)
            data.set('equipmentId', equipmentId)
            data.set('name', name)

            const res = await fetch(`/api/${params.storeId}/upload`, {
                method: 'POST',
                body: data
            })
            if(await res.text() === 'Name already exists') 
            {
                toast.error("Name already exists");
            }
            else
            {
                toast.success("Fle uploaded");
                setFile(null);
                setEquipmentId('');
                setName('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                router.refresh();
            }
        } catch (e: any) {
            console.error(e)
        }
        finally{
            setUploading(false)
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label htmlFor="name" className='mr-5 mb-5'>Name</label>
                <input type="text" name='name' className='border' value={name} onChange={(e) => setName(e.target?.value)} />
                <br/>
                <label htmlFor="equipmentId" className='mr-5 mb-5'>Equipment Id</label>
                <input type="text" name='equipmentId' className='border' value={equipmentId} onChange={(e) => setEquipmentId(e.target?.value)} />
                <br/>
                <label htmlFor="file" className='mr-5'>File</label>
                <input type="file" name='file' ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0])} />
                <br/>
                <Button type='submit' disabled={uploading}>
                    {
                        uploading ? 'Uploading' : 'Upload'
                    }
                </Button>
            </form>
        </div>
    );
};

export default UploadPage;
