import { CategoryForm, getCategories } from "@/modules/admin/categories";
import { HeaderPage } from "@/modules/admin/shared";

export default async function NewCategoryPage() {
    // OBTENER CATEGORIAS
    const categories = await getCategories();
    return (
        <>
            <HeaderPage
                title="Agregar Categoría"
                description="Agrega una nueva categoría para tus productos"
                linkProps={{ linkText: "Volver", url: "/admin/products/categories" }}
            />
            <section className="container pt-8">
                <CategoryForm categories={categories} />
            </section>
        </>
    );
}