import { getHandlingUnits, HanldinglUnitTable } from "@/modules/admin/handling-units";
import { HeaderPage } from "@/modules/admin/shared";

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
            linkText: "Nueva unidad",
            url: "/admin/products/handling-units/new"
          }}
        />

        {/* TABLA DE UNIDADES */}
        <HanldinglUnitTable units={handlingUnits} />
      </>
    </div>
  );
}