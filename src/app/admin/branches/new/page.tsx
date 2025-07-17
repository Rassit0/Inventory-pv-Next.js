import { getAuthUser, hasModuleAccess } from "@/lib";
import { CreateBranchForm } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewBranchPage() {
    // Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();
    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: "BRANCHES", permissions: [RoleModulePermission.Write, RoleModulePermission.Edit] })) redirect("/403");
    const responseUser = await getUsersResponse({ token: authToken });
    return (
        <>
            <HeaderPage
                title="Agrega Sucursal"
                description="Formulario de Registro"
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/branches'
                }}
                button={{
                    popoverText: 'Volver a la lista',
                    delayPopover: 1000,
                    colorButton: 'primary',
                    variantButton: 'flat',
                }}
            />
            <section className="container pt-8">
                <CreateBranchForm
                    token={authToken}
                    users={responseUser ? responseUser.users : []}
                />
            </section>
        </>
    );
}