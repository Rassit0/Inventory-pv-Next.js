import { HeaderPage } from "@/modules/admin/shared";
import { CreateSupplierForm } from "@/modules/admin/suppliers";
import { LinkBackwardIcon } from "hugeicons-react";

export default function NewSupplierPage() {
    return (
        <>
            <HeaderPage
                title="Registrar nuevo proveedor"
                description="Registra un nuevo proveedor para los productos del restaurante"
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/suppliers'
                }}
                isButton
                popoverText='Volver a la lista'
                delayPopover={1000}
            />

            <section className="container pt-8">
                <CreateSupplierForm />
            </section>
        </>
    );
}