import { getHandlingUnits, HanldinglUnitTable } from "@/modules/admin/handling-units";
import { HeaderPage } from "@/modules/admin/shared";
import { Add01Icon } from "hugeicons-react";

export default async function HandlingUnitsPage() {

  const handlingUnits = await getHandlingUnits();

  return (
    <div>
      <>
        {/* HEADER */}
        <HeaderPage
          title="Unidades de Manejo"
          description="Listado de las unidades de manejo de los productos"
          linkProps={{
            linkText: <Add01Icon />,
            url: "/admin/products/handling-units/new"
          }}
          isButton
          colorButton='primary'
          variantButton='flat'
          popoverText="Nueva Unidad"
          delayPopover={1000}
        />

        {/* TABLA DE UNIDADES */}
        <HanldinglUnitTable units={handlingUnits} />
      </>
    </div>
  );
}