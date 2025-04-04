import { IUser, RoleModulePermission } from "@/modules/auth";

// Función reutilizable para verificar permisos
export const hasPermission = (user: IUser, moduleName: string, permission: RoleModulePermission) => {
    // if (user.role) return false;
    return user.role?user.role.roleModule.some(mod => mod.module.name === moduleName && mod.roleModulePermission.some(p => p.permission.name === permission)):false;
}