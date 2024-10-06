"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CalendarIcon, Trash } from "lucide-react"
import { DefectAct, WorkOrder } from "@prisma/client"
import { useParams, useRouter, useSearchParams } from "next/navigation"

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
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { EditModal } from "@/components/modals/edit-modal"
import { DataTable } from "@/components/ui/data-table"
import { defectActColumns } from "../(defectacts)/components/columns"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const formSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(1),
    startDate: z.date(),
    finishDate: z.date()
});

type WorkOrderFormValues = z.infer<typeof formSchema>

interface WorkOrderFormProps {
    initialData: WorkOrder & {equipment: {name:string}} | null;
    defectActs: DefectAct[];
};

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
    initialData,
    defectActs,
}) => {
    const params = useParams();
    const equipmentId = useSearchParams().get('equipmentId');
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [edit, setEdit] = useState(initialData ? false : true);
    const [loading, setLoading] = useState(false);

    const title = !edit ? 'Заказ-наряд' : initialData ? 'Редактировать заказ-наряд' : 'Создать заказ-наряд';
    const description = '';
    const toastMessage = initialData ? 'Заказ-наряд обновлен.' : 'Заказ-наряд создан.';
    const action = initialData ? 'Сохранить изменения' : 'Создать';

    const form = useForm<WorkOrderFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            description: ''
        }
    });

    const onSubmit = async (data: WorkOrderFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/workorder/${params.workOrderId}`, { ...data, equipmentId: equipmentId });
            } else {
                await axios.post(`/api/${params.storeId}/workorder`, { ...data, equipmentId: equipmentId });
            }
            router.push(`/${params.storeId}/workorders?equipmentId=${equipmentId}`);
            router.refresh();
            toast.success(toastMessage);
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const onCreate = async() => { //Create new defect act
        try{
            await axios.post(`/api/${params.storeId}/defectacts`, {workOrderId: params.workOrderId});
            router.refresh();
            toast.success('Заказ наряд создан');
        } catch (error:any){
            toast.error('Something went wrong during adding new defect act.');
        }
    }

    const onChange = () => {
        edit ? setOpenEditModal(true) : setOpenEditModal(false)
        setEdit(!edit);
    }

    const onClose = () => { // close edit modal
        setOpenEditModal(false);
        window.location.reload();
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/workorder/${params.workOrderId}`);
            router.push(`/${params.storeId}/workorders`);
            router.refresh();
            toast.success('Work order deleted.');
        } catch (error: any) {
            toast.error('Make sure you removed all products using this Work order first.');
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
            <EditModal
                isOpen={openEditModal}
                onClose={onClose}
                onConfirm={form.handleSubmit(onSubmit)}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData &&
                    <div className="flex gap-5">
                        <div className="flex items-center gap-1">
                            <Switch id="editMode" onCheckedChange={onChange} />
                            <Label htmlFor="editMode">Редактировать</Label>
                        </div>
                        <Button
                            disabled={loading}
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}
                        >
                            <Trash className="h-4 w-4"/>
                        </Button>
                    </div>
                }
            </div>
            {
                initialData && <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${params.storeId}/equipments`}>Оборудования</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${params.storeId}/equipments/${equipmentId}`}>{initialData?.equipment?.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${params.storeId}/workorders?equipmentId=${initialData.equipmentId}`}>Заказ-наряд</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{initialData.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            }
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="md:grid md:grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Наименование</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading || !edit} placeholder="Наименование заказ-наряда" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Описание</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading || !edit} placeholder="Полное описание заказ-наряда" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel>Дата начала</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild disabled={!edit}>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Выберите дату</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={!edit}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="finishDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel>Дата окончания</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild disabled={!edit}>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Выберите дату</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={!edit}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {edit &&
                        <Button disabled={loading} className="ml-auto" type="submit">
                            {action}
                        </Button>}
                </form>
            </Form>
            <div className="flex justify-between items-center">
                <Heading title={'Дефектные акты'} description={description} />
                <Button onClick={onCreate}>Добавить дефектный акт</Button>
            </div>
            <DataTable searchKey="id" columns={defectActColumns} data={defectActs}/>
            <Separator />
        </>
    );
};