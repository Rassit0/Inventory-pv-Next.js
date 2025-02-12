import { CreateHanldinfUnitForm } from "@/modules/admin/handling-units";
import { HeaderPage } from "@/modules/admin/shared";
import { LinkBackwardIcon } from "hugeicons-react";

export default function NewHandlingUnitsPage() {
  return (
    <>
      <HeaderPage
        title="Agregar Unidad de Manejo"
        description="Agrega una nueva unidad de manejo"
        linkProps={{
          linkText: <LinkBackwardIcon />,
          url: '/admin/products/handling-units'
      }}
      isButton
      popoverText='Volver a la lista'
      delayPopover={1000}
      />
      <section className="container pt-8">
        <CreateHanldinfUnitForm />
      </section>
    </>
  );
}