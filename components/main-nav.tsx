"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Обзор',
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/locations`,
            label: 'Объекты',
            active: pathname === `/${params.storeId}/locations`,
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Категории',
            active: pathname === `/${params.storeId}/categories`,
        },
        {
            href: `/${params.storeId}/equipments`,
            label: 'Оборудования',
            active: pathname === `/${params.storeId}/equipments`,
        },
        {
            href: `/${params.storeId}/calendar`,
            label: 'Календарь',
            active: pathname === `/${params.storeId}/calendar`,
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Настройки',
            active: pathname === `/${params.storeId}/settings`,
        },
    ]

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
};