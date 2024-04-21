import prismadb from "@/lib/prismadb";
import { LocationClient } from "./components/client";
import { LocationColumn } from "./components/columns";

const LocationPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const locations = await prismadb.location.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    const formattedLocations: LocationColumn[] = locations.map((item) => ({
        id: item.id,
        name: item.name,
        responsiblePerson: item.responsiblePerson
        }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <LocationClient data={formattedLocations} />
            </div>
        </div>
    );
}

export default LocationPage;