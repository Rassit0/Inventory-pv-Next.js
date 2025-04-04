import { IUser, RoleModulePermission } from "@/modules/auth";

interface Props {
  user: IUser;
  moduleName: string;
  permissions: RoleModulePermission[]
}

export function hasModuleAccess({ user, moduleName, permissions }: Props): boolean {
  if (!user.role) return false; // Si no tiene un rol, no tiene acceso

  const moduleAccess = user.role.roleModule.find(mod => mod.module.name === moduleName);

  if (!moduleAccess) return false; // Si no tiene acceso al módulo, retorna false

  // Verifica si el usuario tiene todos los permisos requeridos
  return permissions.every(reqPerm =>
    moduleAccess.roleModulePermission.some(modPerm => modPerm.permission.name === reqPerm)
  );
}