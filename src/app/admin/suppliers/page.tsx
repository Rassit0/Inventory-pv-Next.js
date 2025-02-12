import { HeaderPage } from "@/modules/admin/shared";
import { getSuppliers, SupplierTable } from "@/modules/admin/suppliers";
import { Add01Icon } from "hugeicons-react";

export default async function SuppliersPage() {
    const suppliers = await getSuppliers();
    return (
        <>
            <HeaderPage
                title="Proveedores"
                description="Listado de tus proveedores de los productos"
                linkProps={{
                    linkText: <Add01Icon />,
                    url: "/admin/suppliers/new"
                }}
                isButton
                colorButton='primary'
                variantButton='flat'
                popoverText="Nuevo Proveedor"
                delayPopover={1000}
            />

            {/* TABLA PROVEEDORES */}
            <SupplierTable
                suppliers={suppliers || []}
            />
        </>
    );
}