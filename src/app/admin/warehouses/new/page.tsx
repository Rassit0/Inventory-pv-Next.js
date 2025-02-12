import { getBranches } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { CreateWarehouseForm } from "@/modules/admin/warehouses";
import { LinkBackwardIcon } from "hugeicons-react";

export default async function NewWarehousePage() {

    const responseUser = await getUsersResponse({ limit: 0 });
    const branches = await getBranches();

    return (
        <>
            <HeaderPage
                title="Agregar Almacén"
                description="Formulario de Registro"
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/warehouses'
                }}
                isButton
                popoverText='Volver a la lista'
                delayPopover={1000}
            />

            <section className="container pt-8">
                <CreateWarehouseForm
                    usersResponse={responseUser || { users: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } }}
                    branches={branches || []}
                />
            </section>
        </>
    );
}