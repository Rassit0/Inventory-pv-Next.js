import { CategoryTable, getCategories, ISimpleCategory } from "@/modules/admin/categories";
import { HeaderPage } from "@/modules/admin/shared";
import { Add01Icon } from "hugeicons-react";
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
          linkText: <Add01Icon />,
          url: "/admin/products/categories/new"
        }}
        isButton
        colorButton='primary'
        variantButton='flat'
        popoverText="Nueva Categoría"
        delayPopover={1000}
      />

      {/* TABLA DE CATEGORIAS */}
      <CategoryTable
        categories={categories}
      />
    </>
  );
}