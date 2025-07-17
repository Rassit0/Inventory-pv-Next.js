// snnipet rafc
"use client"
import { Button } from '@heroui/react'
import { AlignBoxBottomLeftIcon, CircleIcon, Factory01Icon, Home01Icon, PresentationBarChart01Icon, ProductLoadingIcon, Store01Icon, TruckIcon, UserGroupIcon, WarehouseIcon } from 'hugeicons-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { CollapseItems } from './CollapseItems'
import { IUser } from '@/modules/auth'
import { useUIStore } from '../../stores/ui.store'

interface Props {
    user: IUser
}

export const SideMenuItems = ({ user }: Props) => {

    const router = useRouter();
    const pathname = usePathname();
    const { branchId } = useUIStore();

    return (
        <ul className='flex flex-col gap-4'>

            {user?.role && user.role.roleModule.some(role => role.module.name === 'HOME') ?
                <Button
                    as='li'
                    size='lg'
                    variant='light'
                    color='primary'
                    // onPress={() => router.push(`/admin/home/${branchId ?? 'all'}`)}
                    onPress={() => router.push(`/admin/home`)}
                    className={pathname.includes('/admin/home') ? 'sidemenu__item--active' : 'sidemenu__item'}
                    startContent={<Home01Icon />}
                >
                    Inicio
                </Button>
                : ''}

            {user?.role && user.role.roleModule.some(role => role.module.name === 'BRANCHES') ?
                <Button
                    as='li'
                    size='lg'
                    variant='light'
                    color='primary'
                    onPress={() => router.push('/admin/branches')}
                    className={pathname.includes('/admin/branches') ? 'sidemenu__item--active' : 'sidemenu__item'}
                    startContent={<Store01Icon />}
                >
                    Sucursales
                </Button>
                : ''}

            {user?.role && user.role.roleModule.some(role => role.module.name === 'WAREHOUSES') ?
                <Button
                    as='li'
                    size='lg'
                    variant='light'
                    color='primary'
                    onPress={() => router.push('/admin/warehouses')}
                    className={pathname.includes('/admin/warehouses') ? 'sidemenu__item--active' : 'sidemenu__item'}
                    startContent={<WarehouseIcon />}
                >
                    Almacenes
                </Button>
                : ''}

            {user?.role && user.role.roleModule.some(role => role.module.name === 'SUPPLIERS') ?
                <Button
                    as='li'
                    size='lg'
                    variant='light'
                    color='primary'
                    onPress={() => router.push('/admin/suppliers')}
                    className={pathname.includes('/admin/suppliers') ? 'sidemenu__item--active' : 'sidemenu__item'}
                    startContent={<TruckIcon />}
                >
                    Proveedores
                </Button>
                : ''}

            {user?.role && user.role.roleModule.some(role => role.module.name === 'PRODUCTS') ?
                <CollapseItems
                    title='Productos'
                    ariaLabel='Module Products'
                    moduleIcon={<ProductLoadingIcon />}
                    items={[
                        {
                            label: 'Lista',
                            linkPath: '/admin/products',
                            icon: <CircleIcon size={13} />,
                            // icon: <MenuSquareIcon />
                        },
                        {
                            label: 'Unidades',
                            linkPath: '/admin/products/handling-units',
                            icon: <CircleIcon size={13} />,
                            // icon: <RulerIcon />
                        },
                        {
                            label: 'Categorías',
                            linkPath: '/admin/products/categories',
                            icon: <CircleIcon size={13} />,
                            // icon: <Layers01Icon />
                        },
                    ]}
                />
                : ''}

            {/* {user?.role && user.role.roleModule.some(role => role.module.name === 'INVENTORY') &&
                user?.role && user.role.name !== 'cocinero' ?
                <CollapseItems
                    title='Inventario'
                    ariaLabel='Module Invetory'
                    moduleIcon={<AlignBoxBottomLeftIcon />}
                    items={[
                        // {
                        //     label: 'Entradas',
                        //     linkPath: '/admin/inventory/income',
                        //     icon: <CircleIcon size={13} />,
                        // },
                        // {
                        //     label: 'Salidas',
                        //     linkPath: '/admin/inventory/outcome',
                        //     icon: <CircleIcon size={13} />,
                        // },
                        // {
                        //     label: 'Transferencias',
                        //     linkPath: '/admin/inventory/transfer',
                        //     icon: <CircleIcon size={13} />,
                        // },
                        {
                            label: 'Transacciones',
                            linkPath: '/admin/inventory/movements',
                            icon: <CircleIcon size={13} />,
                        },
                        {
                            label: 'Ajustes',
                            linkPath: '/admin/inventory/adjusment',
                            icon: <CircleIcon size={13} />,
                        },
                    ]}
                />
                : ''} */}

            {user?.role && user.role.roleModule.some(role => role.module.name === 'INVENTORY') ?
                <Button
                    as='li'
                    size='lg'
                    variant='light'
                    color='primary'
                    onPress={() => router.push('/admin/inventory/movements')}
                    className={pathname.includes('/admin/inventory/movements') ? 'sidemenu__item--active' : 'sidemenu__item'}
                    startContent={<AlignBoxBottomLeftIcon />}
                >
                    Inventario
                </Button>
                : ''}

            {(user?.role && user.role.roleModule.some(role => role.module.name === 'PRODUCTION_RECIPES') || (user?.role && user.role.roleModule.some(role => role.module.name === 'PRODUCTION_ORDERS'))) ?
                <CollapseItems
                    title='Producción'
                    ariaLabel='Module Production'
                    moduleIcon={<Factory01Icon />}
                    items={[
                        ...(user.role.roleModule.some(role => role.module.name === 'PRODUCTION_RECIPES')
                            ? [{
                                label: 'Recetas',
                                linkPath: '/admin/production/recipes',
                                icon: <CircleIcon size={13} />,
                            }]
                            : []),
                        ...(user.role.roleModule.some(role => role.module.name === 'PRODUCTION_ORDERS')
                            ? [{
                                label: 'Ordenes',
                                linkPath: '/admin/production/orders',
                                icon: <CircleIcon size={13} />,
                            }]
                            : []),
                    ]}
                />
                : ''}

            {/* {user?.role && user.role.roleModule.some(role => role.module.name === 'REPORTS') ?
                <CollapseItems
                    title='Reportes'
                    ariaLabel='Module Reports'
                    moduleIcon={<PresentationBarChart01Icon />}
                    items={[
                        {
                            label: 'General',
                            linkPath: '/admin/reports/general',
                            icon: <CircleIcon size={13} />,
                        },
                        {
                            label: 'Entradas',
                            linkPath: '/admin/reports/shopping',
                            icon: <CircleIcon size={13} />,
                        },
                        {
                            label: 'Salidas',
                            linkPath: '/admin/reports/inventory',
                            icon: <CircleIcon size={13} />,
                        },
                        {
                            label: 'Producción',
                            linkPath: '/admin/reports/productions',
                            icon: <CircleIcon size={13} />,
                        },
                        {
                            label: 'Proveedores',
                            linkPath: '/admin/reports/suppliers',
                            icon: <CircleIcon size={13} />,
                        },
                    ]}
                />
                : ''} */}

            {user?.role && user.role.roleModule.some(role => role.module.name === 'USERS') ?
                <CollapseItems
                    title='Usuarios'
                    ariaLabel='Module Branches'
                    moduleIcon={<UserGroupIcon />}
                    items={[
                        {
                            label: 'Gestión',
                            linkPath: '/admin/users',
                            icon: <CircleIcon size={13} />,
                        },
                        {
                            label: 'Roles',
                            linkPath: '/admin/users/roles',
                            icon: <CircleIcon size={13} />,
                        },
                    ]}
                />
                : ''}
        </ul>
    )
}
