import { getBranches } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { CreateWarehouseForm } from "@/modules/admin/warehouses";

export default async function NewWarehousePage() {

    const responseUser = await getUsersResponse({ limit: 0 });
    const branches = await getBranches();

    return (
        <>
            <HeaderPage
                title="Agregar Almacén"
                description="Formulario de Registro"
                linkProps={{
                    linkText: 'Volver',
                    url: '/admin/warehouses'
                }}
            />

            <section className="container pt-8">
                <CreateWarehouseForm
                    usersResponse={responseUser!}
                    branches={branches || []}
                />
            </section>
        </>
    );
}