import { getBranches } from '@/modules/admin/branches';
import { getCategories } from '@/modules/admin/categories';
import { getHandlingUnits } from '@/modules/admin/handling-units';
import { CreateProductForm, getProducts } from '@/modules/admin/products'
import { HeaderPage } from '@/modules/admin/shared';
import React from 'react'

export default async function NewProductPage() {
    //OBTENER PRODUCTOS
    const productsResponse = await getProducts(); // limite en 0 devuelve todo
    const categories = await getCategories();
    const handlingUnits = await getHandlingUnits();

    const branches = await getBranches();
    return (
        <>
            <HeaderPage
                title='Agregar Producto'
                description='Agrega un nuevo producto al inventario'
                linkProps={{
                    linkText: 'Volver',
                    url: '/admin/products'
                }}
            />

            <section className='container pt-8'>
                <CreateProductForm
                    products={productsResponse ? productsResponse.products : []}
                    categories={categories}
                    handlingUnits={handlingUnits}
                    branches={branches ?? []}
                />
            </section>
        </>
    )
}
