import { getAuthUser, hasModuleAccess } from '@/lib';
import { getBranches } from '@/modules/admin/branches';
import { getCategories } from '@/modules/admin/categories';
import { getHandlingUnits } from '@/modules/admin/handling-units';
import { CreateProductForm, getProducts } from '@/modules/admin/products'
import { HeaderPage } from '@/modules/admin/shared';
import { getSuppliers } from '@/modules/admin/suppliers';
import { RoleModulePermission } from '@/modules/auth';
import { LinkBackwardIcon } from 'hugeicons-react';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function NewProductPage() {
    // Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();
    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: "PRODUCTS", permissions: [RoleModulePermission.Read] })) redirect("/403");
    //OBTENER PRODUCTOS
    const productsResponse = await getProducts({ token: authToken }); // limite en 0 devuelve todo
    const categories = await getCategories({ token: authToken });
    const handlingUnits = await getHandlingUnits({ token: authToken });

    const branchesResponse = await getBranches({ token: authToken });
    const suppliers = await getSuppliers({ token: authToken });
    return (
        <>
            <HeaderPage
                title='Agregar Producto'
                description='Agrega un nuevo producto al inventario'
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/products'
                }}
                isButton
                popoverText='Volver a la lista'
                delayPopover={1000}
            />

            <section className='container pt-8'>
                <CreateProductForm
                    products={productsResponse ? productsResponse.products : []}
                    categories={categories}
                    handlingUnits={handlingUnits}
                    branches={branchesResponse?.branches ?? []}
                    suppliers={suppliers || []}
                />
            </section>
        </>
    )
}
