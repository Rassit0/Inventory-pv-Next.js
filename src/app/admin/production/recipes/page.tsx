import { Add01Icon } from 'hugeicons-react';
import { HeaderPage } from '../../../../modules/admin/shared/components/HeaderPage';
import { getRecipesResponse, RecipeCardList } from '@/modules/admin/production-recipes';
import { getAuthUser, hasModuleAccess, hasPermission } from '@/lib';
import { RoleModulePermission } from '@/modules/auth';
import { redirect } from 'next/navigation';
import { getProducts } from '@/modules/admin/products';
import { getBranches } from '@/modules/admin/branches';
import { getWarehousesResponse } from '@/modules/admin/warehouses';

export default async function RecipesPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTION_RECIPES", permissions: [RoleModulePermission.Read] })) redirect("/403");
  if (!hasModuleAccess({ user, moduleName: "PRODUCTS", permissions: [RoleModulePermission.Read] })) redirect("/403");
  if (!hasModuleAccess({ user, moduleName: "BRANCHES", permissions: [RoleModulePermission.Read] })) redirect("/403");
  if (!hasModuleAccess({ user, moduleName: "WAREHOUSES", permissions: [RoleModulePermission.Read] })) redirect("/403");
  const recipesResponse = await getRecipesResponse({ token: authToken });
  const productsResponse = await getProducts({ token: authToken, limit: 5, status: 'active' });
  const branchesResponse = await getBranches({ token: authToken });
  const warehousesResponse = await getWarehousesResponse({ token: authToken });
  return (
    <>
      <HeaderPage
        title='Recetas del Restaurante'
        description='Crea y elabora diferentes recetas'
        linkProps={{
          linkText: <Add01Icon />,
          url: "/admin/production/recipes/new"
        }}
        isButton
        colorButton='primary'
        variantButton='flat'
        popoverText="Nueva Receta"
        delayPopover={1000}
      />

      {/* TABLA RECETAS */}
      <RecipeCardList
        token={authToken}
        writeProduction={hasPermission(user, "PRODUCTION", RoleModulePermission.Write)}
        editRecipe={hasPermission(user, "PRODUCTION_RECIPES", RoleModulePermission.Edit)}
        deleteRecipe={hasPermission(user, "PRODUCTION_RECIPES", RoleModulePermission.Delete)}
        recipesResponse={recipesResponse || { meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 }, recipes: [] }}
        productsResponse={productsResponse}
        branches={branchesResponse?.branches || []}
        warehouses={warehousesResponse?.warehouses || []}
      />

    </>
  );
}