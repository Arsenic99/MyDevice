'use client'

import { useEffect, useState } from "react";
import Search from "./ui/search";
import axios from "axios";
import { useParams, usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ReadQRModal } from "./modals/readqr-modal";
import { QrCode } from "lucide-react";

export const SearchBar = () => {

    const [input, setInput] = useState('');
    const router = useRouter();
    const url = usePathname();
    const params = useParams()

    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
        window.location.reload();
    }

    useEffect(() => {
        setInput('');
    }, [url])

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        if (input.trim().length === 0) return;

        try {
            const equipment = await axios.get(`/api/${params.storeId}/equipments/serialNumber`, {
                params: { serialNumber: input.trim() }
            });

            if (equipment.data.length > 0) {
                setInput('');
                router.push(`/${equipment.data[0].storeId}/equipments/${equipment.data[0].id}`);
            } else {
                toast.error("No equipment found");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <ReadQRModal
                isOpen={open}
                onClose={onClose}
            />
            <button onClick={()=>setOpen(true)}>
                <QrCode className="h-5 w-5 mr-2" />
            </button>
            <Search input={input} setInput={(input: any) => setInput(input)} submitHandler={submitHandler}/>
        </>
    );
};
