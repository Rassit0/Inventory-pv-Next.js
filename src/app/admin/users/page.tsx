import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { UserTable } from "@/modules/admin/users/components/user-table/UserTable";

export default async function UsersPage() {
  const usersResponse = await getUsersResponse({ limit: 10 });
  return (
    <>
      <HeaderPage
        title="Usuarios"
        description="Listado de los usuarios de tu sistema de restaurante"
        linkProps={{
          linkText: "Nuevo Usuario",
          url: "/admin/users/new"
        }}
      />

      {/* TABLA DE USUARIOS */}
      {usersResponse && (
        <UserTable
          usersResponse={usersResponse}
        />
      )}
    </>
  );
}