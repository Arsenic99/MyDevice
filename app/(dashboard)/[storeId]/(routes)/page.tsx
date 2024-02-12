import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";

const DashboardPage = async () => {
    const locations = await axios.get(`${process.env.URL}/api/71e79fe3-e876-4e50-80a5-3c07ff1d970b/locations`);
    const categories = await axios.get(`${process.env.URL}/api/71e79fe3-e876-4e50-80a5-3c07ff1d970b/categories`);
    const equipments = await axios.get(`${process.env.URL}/api/71e79fe3-e876-4e50-80a5-3c07ff1d970b/equipments`);
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Accordion type="single" collapsible className="w-full">
                    {
                        locations.data.slice().sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)).map((item: { name: string, id: string }, index: number) => (
                            <AccordionItem value={`item-${index + 1}`} key={index}>
                                <AccordionTrigger>{item.name}</AccordionTrigger>
                                <AccordionContent>
                                    <Accordion type="single" collapsible className="w-full pl-2">
                                        {
                                            categories.data.filter((catItem: { locationId: string }) => (catItem.locationId === item.id)).slice().sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)).map((item: { name: string, id: string }, index: number) => (
                                                <AccordionItem value={`item-${index + 1}`} key={index}>
                                                    <AccordionTrigger>{item.name}</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Accordion type="single" collapsible className="w-full pl-2">
                                                            {equipments.data.filter((locItem: { categoryId: string }) => (locItem.categoryId === item.id)).length === 0 ? (
                                                                <div>No equipment available</div>
                                                            ) : (
                                                                equipments.data
                                                                    .filter((locItem: { categoryId: string }) => (locItem.categoryId === item.id))
                                                                    .slice()
                                                                    .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
                                                                    .map((item: { name: string, storeId: string, id: string }, index: number) => (
                                                                        <AccordionItem value={`item-${index + 1}`} key={index}>
                                                                            <Link href={`${process.env.URL}/${item.storeId}/equipments/${item.id}`} className="flex flex-1 items-center justify-between py-4 font-medium">{item.name}</Link>
                                                                        </AccordionItem>
                                                                    ))
                                                            )}
                                                        </Accordion>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))
                                        }
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    }
                </Accordion>
            </div>
        </div>
    );
}

export default DashboardPage;