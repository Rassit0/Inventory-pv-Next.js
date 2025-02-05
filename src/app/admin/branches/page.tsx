import { BranchTable, getBranches } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";

export default async function BranchesPage() {
  const branches = await getBranches();
  const usersResponse = await getUsersResponse();
  return (
    <>
      <HeaderPage
        title="Sucursales"
        description="Listado de tus sucursales del restaurante"
        linkProps={{
          linkText: 'Nueva Sucursal',
          url: '/admin/branches/new'
        }}
      />

      {/* TABLA SUCURSALES */}
      <BranchTable
        branches={branches || []}
        users={usersResponse?.users || []}
      />
    </>
  );
}