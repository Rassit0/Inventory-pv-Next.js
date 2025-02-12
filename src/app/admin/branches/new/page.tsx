import { CreateBranchForm } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { LinkBackwardIcon } from "hugeicons-react";

export default async function NewBranchPage() {
    const responseUser = await getUsersResponse();
    return (
        <>
            <HeaderPage
                title="Agrega Sucursal"
                description="Formulario de Registro"
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/branches'
                }}
                isButton
                popoverText='Volver a la lista'
                delayPopover={1000}
            />
            <section className="container pt-8">
                <CreateBranchForm
                    users={responseUser ? responseUser.users : []}
                />
            </section>
        </>
    );
}