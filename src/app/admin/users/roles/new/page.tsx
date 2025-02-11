import { HeaderPage } from "@/modules/admin/shared";
import { CreateUserRoleForm } from "@/modules/admin/user-roles";

export default function NewUserRolePage() {
    return (
        <>
            <HeaderPage
                title="Registrar Rol"
                description="Formulario de Registro"
                linkProps={{
                    linkText: 'Volver',
                    url: '/admin/users/roles'
                }}
            />
            <section className="container pt-8">
                <CreateUserRoleForm/>
            </section>
        </>
    );
}