import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";
import { UserPanel } from "./user-panel";

const Navbar = async () => {

    const stores = await prismadb.store.findMany();

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores} />
                <MainNav className="mx-6" />
                <UserPanel/>
            </div>
        </div>
    );
};

export default Navbar;