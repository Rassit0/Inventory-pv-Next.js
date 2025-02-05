import { HeaderPage } from "@/modules/admin/shared";
import { getWarehouses, WarehouseTable } from "@/modules/admin/warehouses";

export default async function WarehousesPage() {

  const warehouses = await getWarehouses();

  return (
    <>
      <HeaderPage
        title="Almacenes"
        description="Listado de los almacenes del restaurante"
        linkProps={{
          linkText: 'Nuevo Almacén',
          url: '/admin/warehouses/new'
        }}
      />

      {/* TABLA DE ALMACENES */}
      <WarehouseTable
        warehouses={warehouses ?? []}
      />
    </>
  );
}