import { BranchTable, getBranches } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { Add01Icon } from "hugeicons-react";

export default async function BranchesPage() {
  const branches = await getBranches();
  const usersResponse = await getUsersResponse();
  return (
    <>
      <HeaderPage
        title="Sucursales"
        description="Listado de tus sucursales del restaurante"
        linkProps={{
          linkText: <Add01Icon />,
          url: "/admin/branches/new"
        }}
        isButton
        colorButton='primary'
        variantButton='flat'
        popoverText="Nueva Sucursal"
        delayPopover={1000}
      />

      {/* TABLA SUCURSALES */}
      <BranchTable
        branches={branches || []}
        users={usersResponse?.users || []}
      />
    </>
  );
}