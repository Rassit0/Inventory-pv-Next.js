import { CategoryForm, getCategories } from "@/modules/admin/categories";
import { HeaderPage } from "@/modules/admin/shared";
import { LinkBackwardIcon } from "hugeicons-react";

export default async function NewCategoryPage() {
    // OBTENER CATEGORIAS
    const categories = await getCategories();
    return (
        <>
            <HeaderPage
                title="Agregar Categoría"
                description="Agrega una nueva categoría para tus productos"
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/products/categories'
                }}
                isButton
                popoverText='Volver a la lista'
                delayPopover={1000}
            />
            <section className="container pt-8">
                <CategoryForm categories={categories} />
            </section>
        </>
    );
}