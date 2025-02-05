// snnipet rafc
import { Accordion, AccordionItem, Button } from '@nextui-org/react'
import { AlignBoxBottomLeftIcon, BoxerIcon, BoxingBagIcon, CircleIcon, Factory01Icon, HelpCircleIcon, Home01Icon, Invoice01Icon, Layers01Icon, MenuSquareIcon, PresentationBarChart01Icon, ProductLoadingIcon, RulerIcon, Settings01Icon, ShoppingBag01Icon, Store01Icon, TruckIcon, UserGroupIcon, UserListIcon, UserMultipleIcon, WarehouseIcon } from 'hugeicons-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { CollapseItems } from './CollapseItems'

export const SideMenuItems = () => {

    const router = useRouter();
    const pathname = usePathname();

    return (
        <ul className='flex flex-col gap-4'>

            <Button
                as='li'
                size='lg'
                variant='light'
                color='primary'
                onPress={() => router.push('/admin/home')}
                className={pathname.includes('/admin/home') ? 'sidemenu__item--active' : 'sidemenu__item'}
                startContent={<Home01Icon />}
            >
                Inicio
            </Button>

            <CollapseItems
                title='Sucursales'
                ariaLabel='Module Branches'
                moduleIcon={<Store01Icon />}
                items={[
                    {
                        label: 'Gestión',
                        linkPath: '/admin/branches',
                        icon: <CircleIcon size={13}/>
                    },
                    {
                        label: 'Reportes',
                        linkPath: '/admin/branches/reports',
                        icon: <CircleIcon size={13}/>,
                        // icon: <PresentationBarChart01Icon />
                        subItems:[
                            {
                                title:'Reportes',
                                ariaLabel:"Module Branches",
                                items:[
                                    {
                                        label:'Inventario por Sucursal',
                                        linkPath:'/admin/branches/reports/inventory-by-branch',
                                    },
                                    {
                                        label:'Movimientos por Sucursal',
                                        linkPath:'/admin/branches/reports/movements-by-branch',
                                    }
                                ]
                            },
                        ]
                    },
                ]}
            />

            <CollapseItems
                title='Proveedores'
                ariaLabel='Module Suppliers'
                moduleIcon={<TruckIcon />}
                items={[
                    {
                        label: 'Gestión',
                        linkPath: '/admin/suppliers',
                        icon: <CircleIcon size={13}/>
                    },
                    {
                        label: 'Ordenes',
                        linkPath: '/admin/suppliers/orders',
                        icon: <CircleIcon size={13}/>
                    },
                    {
                        label: 'Reportes',
                        linkPath: '/admin/suppliers/reports',
                        icon: <CircleIcon size={13}/>
                        // icon: <PresentationBarChart01Icon />
                    },
                ]}
            />

            <CollapseItems
                title='Almacenes'
                ariaLabel='Module Warehouses'
                moduleIcon={<WarehouseIcon />}
                items={[
                    {
                        label: 'Gestión',
                        linkPath: '/admin/warehouses',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Transferencias',
                        linkPath: '/admin/warehouses/transfers',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Reportes',
                        linkPath: '/admin/warehouses/reports',
                        icon: <CircleIcon size={13}/>,
                        // icon: <PresentationBarChart01Icon />
                    },
                ]}
            />

            <CollapseItems
                title='Productos'
                ariaLabel='Module Products'
                moduleIcon={<ProductLoadingIcon />}
                items={[
                    {
                        label: 'Lista',
                        linkPath: '/admin/products',
                        icon: <CircleIcon size={13}/>,
                        // icon: <MenuSquareIcon />
                    },
                    {
                        label: 'Unidades',
                        linkPath: '/admin/products/handling-units',
                        icon: <CircleIcon size={13}/>,
                        // icon: <RulerIcon />
                    },
                    {
                        label: 'Categorías',
                        linkPath: '/admin/products/categories',
                        icon: <CircleIcon size={13}/>,
                        // icon: <Layers01Icon />
                    },
                    {
                        label: 'Reportes',
                        linkPath: '/admin/products/reports',
                        icon: <CircleIcon size={13}/>,
                        // icon: <PresentationBarChart01Icon />
                    },
                ]}
            />

            <CollapseItems
                title='Producción'
                ariaLabel='Module Production'
                moduleIcon={<Factory01Icon />}
                items={[
                    {
                        label: 'Recetas',
                        linkPath: '/admin/production/recipes',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Ordenes',
                        linkPath: '/admin/production/orders',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Costos',
                        linkPath: '/admin/production/costs',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Reportes',
                        linkPath: '/admin/production/reports',
                        icon: <CircleIcon size={13}/>,
                        // icon: <PresentationBarChart01Icon />
                    },
                ]}
            />

            {/* <CollapseItems
                title='Compras'
                ariaLabel='Module Branches'
                moduleIcon={<ShoppingBag01Icon />}
                items={[
                    {
                        label: 'Ordenes',
                        linkPath: '/admin/branches',
                    },
                    {
                        label: 'Historial',
                        linkPath: '/admin/branches',
                    },
                    {
                        label: 'Reportes',
                        linkPath: '/admin/branches/reports',
                        icon: <PresentationBarChart01Icon />
                    },
                ]}
            /> */}

            <CollapseItems
                title='Inventario'
                ariaLabel='Module Invetory'
                moduleIcon={<AlignBoxBottomLeftIcon />}
                items={[
                    {
                        label: 'Entradas',
                        linkPath: '/admin/inventory/entries',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Salidas',
                        linkPath: '/admin/inventory/exits',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Devolución',
                        linkPath: '/admin/inventory/returns',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Ajustes',
                        linkPath: '/admin/inventory/settings',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Conteos',
                        linkPath: '/admin/inventory/counts',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Reportes',
                        linkPath: '/admin/inventory/reports',
                        icon: <CircleIcon size={13}/>,
                        // icon: <PresentationBarChart01Icon />
                    },
                ]}
            />

            <CollapseItems
                title='Reportes'
                ariaLabel='Module Reports'
                moduleIcon={<PresentationBarChart01Icon />}
                items={[
                    {
                        label: 'Invetario General',
                        linkPath: '/admin/reports/general',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Compras',
                        linkPath: '/admin/reports/shopping',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Producción',
                        linkPath: '/admin/reports/productions',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Proveedores',
                        linkPath: '/admin/reports/suppliers',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Movimientos de inventario',
                        linkPath: '/admin/reports/inventory',
                        icon: <CircleIcon size={13}/>,
                    },
                ]}
            />

            <CollapseItems
                title='Usuarios'
                ariaLabel='Module Branches'
                moduleIcon={<UserGroupIcon />}
                items={[
                    {
                        label: 'Gestión',
                        linkPath: '/admin/users',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Roles',
                        linkPath: '/admin/users/roles',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Reportes',
                        linkPath: '/admin/users/reports',
                        icon: <CircleIcon size={13}/>,
                        // icon: <PresentationBarChart01Icon />
                    },
                ]}
            />
            <CollapseItems
                title='Configuración'
                ariaLabel='Module Branches'
                moduleIcon={<Settings01Icon />}
                items={[
                    {
                        label: 'General',
                        linkPath: '/admin/settings',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Notificaciones',
                        linkPath: '/admin/settings/notifications',
                        icon: <CircleIcon size={13}/>,
                    },
                    {
                        label: 'Integraciones',
                        linkPath: '/admin/settings/integrations',
                        icon: <CircleIcon size={13}/>,
                    },
                ]}
            />

            <CollapseItems
                title='Soporte'
                ariaLabel='Module Supoort'
                moduleIcon={<HelpCircleIcon />}
                items={[
                    {
                        label: 'Documentación',
                        linkPath: '/admin/support/documentation',
                    },
                    {
                        label: 'Contacto',
                        linkPath: '/admin/support/contact',
                    },
                    {
                        label: 'Preguntas frecuentes',
                        linkPath: '/admin/support/faq',
                    },
                ]}
            />

            {/* <Button
                as='li'
                size='lg'
                variant='light'
                color='primary'
                onPress={() => router.push('/admin/orders')}
                className={pathname.includes('/admin/orders') ? 'sidemenu__item--active' : 'sidemenu__item'}
                startContent={<Invoice01Icon />}
            >
                Ordenes
            </Button>

            <Button
                as='li'
                size='lg'
                variant='light'
                color='primary'
                onPress={() => router.push('/admin/users')}
                className={pathname.includes('/admin/users') ? 'sidemenu__item--active' : 'sidemenu__item'}
                startContent={<UserMultipleIcon />}
            >
                Usuarios
            </Button> */}
        </ul>
    )
}
