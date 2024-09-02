"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Category, Equipment, Event, File } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { DialogModal } from "@/components/modals/dialog-modal"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { EventModal } from "@/components/modals/event-modal"

const formSchema = z.object({
    name: z.string().min(1),
    categoryId: z.string().min(1),
    serialNumber: z.string().min(0),
    inventoryNumber: z.string().min(0),
});

type EquipmentFormValues = z.infer<typeof formSchema>

interface EquipmentFormProps {
    initialData: Equipment | null,
    categories: ({
        location: {
            name: string;
        };
    } & Category)[],
    files: File[],
    events: Event[]
};

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
    initialData,
    categories,
    files,
    events
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEvent, setOpenEvent] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit equipment' : 'Create equipment';
    const description = initialData ? 'Edit a equipment' : 'Add a new equipment';
    const toastMessage = initialData ? 'Equipment updated.' : 'Equipment created.';
    const action = initialData ? 'Save changes' : 'Create';

    const defaultValues = initialData ? {
        ...initialData,
    } : {
        name: '',
        categoryId: '',
        serialNumber: '',
        inventoryNumber: '',
    }

    const form = useForm<EquipmentFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: EquipmentFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/equipments/${params.equipmentId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/equipments`, data);
            }
            router.push(`/${params.storeId}/equipments`);
            router.refresh();
            toast.success(toastMessage);
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/equipments/${params.equipmentId}`);
            router.push(`/${params.storeId}/equipments`);
            router.refresh();
            toast.success('Product deleted.');
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DialogModal
                isOpen={openDialog}
                onClose={() => setOpenDialog(false)}
                loading={loading}
            />
            <EventModal
                isOpen={openEvent}
                onClose={() => setOpenEvent(false)}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                <div className="flex items-center justify-between gap-5">
                    <Button size="sm" onClick={() => setOpenDialog(!openDialog)}>
                        Add file
                    </Button>
                    {
                        initialData && <Button size="sm" onClick={() => setOpenEvent(!openEvent)}>
                                            Add event
                                        </Button>
                    }
                    
                    {initialData && (
                        <Button
                            disabled={loading}
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="serialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Serial Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product serial number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inventoryNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inventory Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product inventory number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.slice().sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
                                                <SelectItem key={category.id} value={category.id}>{`Category: ${category.name} / Location: ${category.location.name}`}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>


                    {
                        initialData && (
                            <>
                                {/* Таблица документации */}
                                <Heading title={`Документация`} description="Список документации оборудования" />
                                <Separator />
                                <DataTable searchKey="fileName" columns={columns} data={files} />

                                {/* Таблица событии */}
                                <Heading title={`События`} description="Список ремонта и ТО" />
                                <Separator />
                                <DataTable searchKey="title" columns={eventColumns} data={events} />
                            </>
                        )
                    }
                </form>
            </Form>
        </>
    );
};

type FileColumn = {
    id: string;
    fileName: string;
    path: string;
    equipmentId: string;
    createdAt: Date;
}

const columns: ColumnDef<FileColumn>[] = [
    {
        accessorKey: "fileName",
        header: "File name",
        cell: ({ row }) => <Link className="w-full" target="_blank" href={`http://localhost:3000/${row.original.equipmentId}/${row.original.path}`} download={true}>{row.original.fileName}</Link>
    },
    {
        accessorKey: "createdAt",
        header: "Created at",
    }
];

type EventColumn = {
    id: string;
    title: string;
    equipmentId: string;
    createdAt: Date;
}

const eventColumns: ColumnDef<EventColumn>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "createdAt",
        header: "Created at",
    }
];