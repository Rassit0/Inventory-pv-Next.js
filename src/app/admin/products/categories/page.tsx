import { CategoryTable, getCategories, ISimpleCategory } from "@/modules/admin/categories";
import { HeaderPage } from "@/modules/admin/shared";
import { toast } from "sonner";

export default async function CategoriesPage() {

  // OBTENER CATEGORIAS
  const categories = await getCategories();

  return (
    <>
      {/* HEADER */}
      <HeaderPage
        title="Categorías"
        description="Listado de tus categorías en el restaurante"
        linkProps={{
          linkText: "Nueva Categoría",
          url: "/admin//products/categories/new"
        }}
      />

      {/* TABLA DE CATEGORIAS */}
      <CategoryTable
        categories={categories}
      />
    </>
  );
}