import { getAuthUser, hasModuleAccess, hasPermission } from '@/lib';
import { getBranchesResponse } from '@/modules/admin/branches';
import { getCategories } from '@/modules/admin/categories';
import { getHandlingUnits } from '@/modules/admin/handling-units';
import { getPersonsResponse } from '@/modules/admin/persons';
import { CreateProductForm, getProducts } from '@/modules/admin/products'
import { HeaderPage } from '@/modules/admin/shared';
import { getSuppliersResponse } from '@/modules/admin/suppliers';
import { RoleModulePermission } from '@/modules/auth';
import { LinkBackwardIcon } from 'hugeicons-react';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function NewProductPage() {
    // Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();
    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: "PRODUCTS", permissions: [RoleModulePermission.Read] })) redirect("/403");
    if (!hasModuleAccess({ user, moduleName: "SUPPLIERS", permissions: [RoleModulePermission.Read] })) redirect("/403");

    //OBTENER PRODUCTOS
    const productsResponse = await getProducts({ token: authToken }); // limite en 0 devuelve todo
    const categories = await getCategories({ token: authToken });
    const handlingUnits = await getHandlingUnits({ token: authToken });

    const branchesResponse = await getBranchesResponse({ token: authToken });
    const personsResponse = await getPersonsResponse({ token: authToken, orderBy: 'asc', columnOrderBy: 'name', limit: 10, page: 1 });
    const suppliersResponse = await getSuppliersResponse({ token: authToken, orderBy: 'asc', columnOrderBy: 'name', limit: 10, page: 1 });
    return (
        <>
            <HeaderPage
                title='Agregar Producto'
                description='Agrega un nuevo producto al inventario'
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/products'
                }}
                button={{
                    popoverText: 'Volver a la lista',
                    delayPopover: 1000,
                    colorButton: 'primary',
                    variantButton: 'flat'
                }}
            />

            <section className='container pt-8'>
                <CreateProductForm
                    token={authToken}
                    products={productsResponse ? productsResponse.products : []}
                    categories={categories}
                    handlingUnits={handlingUnits}
                    branches={branchesResponse?.branches ?? []}
                    supplierProps={{
                        create: {
                            createSupplier: hasPermission(user, "SUPPLIERS", RoleModulePermission.Write),
                            createContact: hasPermission(user, "SUPPLIERS_CONTACTS", RoleModulePermission.Write),
                            personsResponse: personsResponse || {
                                persons: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 },
                            }
                        },
                        suppliersResponse: suppliersResponse || {
                            suppliers: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 },
                        },
                    }}
                />
            </section>
        </>
    )
}
