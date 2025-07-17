import { getAuthUser, hasModuleAccess } from "@/lib";
import { CategoryForm, getCategories } from "@/modules/admin/categories";
import { HeaderPage } from "@/modules/admin/shared";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function NewCategoryPage() {// Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();
    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: "PRODUCTS_CATEGORIES", permissions: [RoleModulePermission.Write] })) redirect("/403");
    // OBTENER CATEGORIAS
    const categories = await getCategories({ token: authToken });
    return (
        <>
            <HeaderPage
                title="Agregar Categoría"
                description="Agrega una nueva categoría para tus productos"
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/products/categories'
                }}
                button={{
                    popoverText: 'Volver a la lista',
                    delayPopover: 1000,
                    colorButton: 'primary',
                    variantButton: 'flat'
                }}
            />
            <section className="container pt-8">
                <CategoryForm categories={categories} token={authToken} />
            </section>
        </>
    );
}