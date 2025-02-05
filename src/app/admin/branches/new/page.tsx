import { CreateBranchForm } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";

export default async function NewBranchPage() {
    const responseUser = await getUsersResponse();
    return (
        <>
            <HeaderPage
                title="Agrega Sucursal"
                description="Formulario de Registro"
                linkProps={{
                    linkText: 'Volver',
                    url: '/admin/branches'
                }}
            />
            <section className="container pt-8">
                <CreateBranchForm
                    users={responseUser ? responseUser.users : []}
                />
            </section>
        </>
    );
}