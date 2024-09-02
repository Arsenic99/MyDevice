'use client'

import { useEffect, useState } from "react";
import Search from "./ui/search";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const SearchBar = ({
    params
}: {
    params: string;
}) => {

    const [input, setInput] = useState('');
    const router = useRouter();
    const url = usePathname();

    useEffect(()=>{
        setInput('');
    },[url])

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        if (input.trim().length === 0) return;

        try {
            const equipment = await axios.get(`/api/99637b7f-79f9-497c-b3ef-6c8bf09ab514/equipments/serialNumber`, {
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
        <Search input={input} setInput={(input: any) => setInput(input)} submitHandler={submitHandler} />
    );
};
