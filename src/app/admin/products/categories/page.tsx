import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { CategoryTable, getCategories, ISimpleCategory } from "@/modules/admin/categories";
import { HeaderPage } from "@/modules/admin/shared";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function CategoriesPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTS_CATEGORIES", permissions: [RoleModulePermission.Read] })) redirect("/403");

  // OBTENER CATEGORIAS
  const categories = await getCategories({ token: authToken });

  return (
    <>
      {/* HEADER */}
      <HeaderPage
        title="Categorías"
        description="Listado de tus categorías en el restaurante"
        linkProps={
          hasPermission(user, "PRODUCTS_CATEGORIES", RoleModulePermission.Write)
            ? {
              linkText: <Add01Icon />,
              url: "/admin/products/categories/new"
            }
            : undefined
        }
        isButton
        colorButton='primary'
        variantButton='flat'
        popoverText="Nueva Categoría"
        delayPopover={1000}
      />

      {/* TABLA DE CATEGORIAS */}
      <CategoryTable
        editCategory={hasPermission(user, "PRODUCTS_CATEGORIES", RoleModulePermission.Edit)}
        deleteCategory={hasPermission(user, "PRODUCTS_CATEGORIES", RoleModulePermission.Delete)}
        categories={categories}
        token={authToken}
      />
    </>
  );
}