import { HeaderPage } from "@/modules/admin/shared";
import { getSuppliers, SupplierTable } from "@/modules/admin/suppliers";

export default async function SuppliersPage() {
    const suppliers = await getSuppliers();
    return (
        <>
            <HeaderPage
                title="Proveedores"
                description="Listado de tus proveedores de los productos"
                linkProps={{
                    linkText: 'Nuevo Proveedor',
                    url: '/admin/suppliers/new'
                }}
            />

            {/* TABLA PROVEEDORES */}
            <SupplierTable
                suppliers={suppliers || []}
            />
        </>
    );
}