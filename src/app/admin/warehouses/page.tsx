import { getBranches } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { getWarehousesResponse, WarehouseTable } from "@/modules/admin/warehouses";

export default async function WarehousesPage() {

  const warehousesResponse = await getWarehousesResponse();
  const responseUser = await getUsersResponse({ limit: 0 });
  const branches = await getBranches();

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
        warehousesResponse={warehousesResponse ?? { meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 }, warehouses: [] }}
        usersResponse={responseUser || { users: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } }}
        branches={branches || []}
      />
    </>
  );
}