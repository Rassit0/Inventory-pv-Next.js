"use client"
import React from 'react'
import { IRole } from '@/modules/admin/user-roles'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { Delete01Icon, PencilEdit01Icon } from 'hugeicons-react'

interface Props {
    roles: IRole[]
}

export const UserRolesTable = ({ roles }: Props) => {
    const permissionMap = {
        'READ': 'leer',
        'WRITE': 'escribir',
        'EDIT': 'editar',
        'DELETE': 'eliminar',
        'MANAGE': 'gestionar',
    };

    const moduleMap = {
        'USERS': 'Usuarios',
        'USERS_ROLES': 'Roles',
        'REPORTS': 'Reportes',
        'INVENTORY': 'Inventario',
        'INVENTORY_ENTRY': 'Entradas',
        'INVENTORY_EXIT': 'Salidas',
        'INVENTORY_INCOME': 'Entradas',
        'INVENTORY_OUTCOME': 'Salidas',
        'INVENTORY_TRANSFER': 'Transferencias',
        'INVENTORY_ADJUSTMENT': 'Ajustes',
        'PRODUCTS': 'Productos',
        'PRODUCTS_CATEGORIES': 'Categorías',
        'PRODUCTS_UNITS': 'Unidades Manejo',
        'SETTINGS': 'Configuración',
        'BRANCHES': 'Sucursales',
        'PRODUCTION': 'Producción',
        'PRODUCTION_RECIPES': 'Recetas',
        'WAREHOUSES': 'Almacenes',
        'SUPPLIERS': 'Proveedores',
        'SUPPLIERS_CONTACTS': 'Contactos',
        'HOME': 'Inicio',
        'NOTIFICATIONS': 'Notificaciones',
        'NOTIFICATIONS_LOW_STOCK': 'Stock Bajo',
    };
    return (
        <section className='container pt-8'>
            <div className="flex flex-col space-y-2">
                {roles.map(role => (
                    <div key={role.id} className="bg-white p-5 rounded-xl shadow-md border">
                        {/* Nombre del Rol y Acciones */}
                        <div className="flex justify-between items-center ">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">{role.name}</h2>
                                <p className="text-gray-600">{role.description || 'Sin descripción'}</p>
                            </div>
                            {/* <div className="flex flex-col sm:flex-row gap-2">
                                <Button size="sm" variant="light" color='warning'>
                                    <PencilEdit01Icon size={16} /> Editar
                                </Button>
                                <Button size="sm" variant="light" color='danger'>
                                    <Delete01Icon size={16} /> Eliminar
                                </Button>
                            </div> */}
                        </div>

                        {/* Módulos y Permisos */}
                        {role.roleModule.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                {role.roleModule.map(module => (
                                    <div
                                        key={module.module.name}
                                        className="w-full border p-3 rounded-md bg-gray-50 shadow-sm min-w-[120px] max-w-full"
                                    >
                                        {/* Nombre del Módulo con Truncamiento */}
                                        <span
                                            className="font-semibold block overflow-hidden text-ellipsis whitespace-nowrap"
                                            title={module.module.name}
                                        >
                                            {moduleMap[module.module.name as keyof typeof moduleMap]}
                                        </span>
                                        {module.module.parentModule && (
                                            <span className="text-gray-500 text-sm">
                                                {' '}({moduleMap[module.module.parentModule.name as keyof typeof moduleMap]})
                                            </span>
                                        )}
                                        <ul className="list-disc pl-5 mt-1 text-gray-700 text-sm">
                                            {module.roleModulePermission.length > 0 ? (
                                                module.roleModulePermission.map((perm, index) => (
                                                    <li key={index}>
                                                        {permissionMap[perm.permission.name as keyof typeof permissionMap] || perm.permission.name}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-400">Sin permisos</li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">Sin módulos asignados</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}
