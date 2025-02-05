import { HeaderPage } from "@/modules/admin/shared";
import { CreateSupplierForm } from "@/modules/admin/suppliers";

export default function NewSupplierPage() {
    return (
        <>
            <HeaderPage
                title="Registrar nuevo proveedor"
                description="Registra un nuevo proveedor para los productos del restaurante"
                linkProps={{
                    linkText: 'Volver',
                    url: '/admin/suppliers'
                }}
            />

            <section className="container pt-8">
                <CreateSupplierForm/>
            </section>
        </>
    );
}