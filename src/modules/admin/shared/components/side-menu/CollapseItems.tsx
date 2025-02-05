"use client"
import { Accordion, AccordionItem, Button } from '@heroui/react';
import { ArrowDown01Icon, IconjarIcon, Layers01Icon, MenuSquareIcon, ProductLoadingIcon, RulerIcon } from 'hugeicons-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useState } from 'react'

// Definimos un tipo para los ítems
interface IItem {
    label: string; // Etiqueta del botón
    linkPath: string; // Ruta para redireccionar
    icon?: ReactNode; // Icono opcional
    subItems?: Props[]; //Items secundatios (sub-accordion)
}

// Propiedades de componente
interface Props {
    items: IItem[];         // Lista de items a renderizar
    title: string;    // Título del módulo
    ariaLabel: string;      // Etiqueta accesible para el módulo
    moduleIcon?: ReactNode;  // Icono para el módulo
}

export const CollapseItems = ({ items, title, ariaLabel, moduleIcon }: Props) => {

    const router = useRouter();
    const pathname = usePathname();
    return (
        <div className='my-1'>
            <Accordion
                as='li'
                isCompact
                variant="light"
                defaultExpandedKeys={[
                    items.some(item => pathname.includes(item.linkPath)) ? ariaLabel : "",
                ]}
            >
                <AccordionItem
                    key={ariaLabel}
                    aria-label={ariaLabel}
                    title={<div className='text-gray-600'>{title}</div>}
                    startContent={moduleIcon || null}
                    className='sidemenu__scroll-item'
                >

                    <div className='w-full overflow-hidden'>
                        {
                            items.map(((item, index) => (
                                <div key={item.linkPath || index}>
                                    {/* Si el item tiene subItems, renderizamos un Accordion dentro de este item */}
                                    {item.subItems && item.subItems.length > 0 ? (
                                        item.subItems.map((subItem, subIndex) => (
                                            <CollapseItems
                                                key={subItem.ariaLabel || subIndex}
                                                ariaLabel={subItem.ariaLabel}
                                                title={subItem.title}
                                                moduleIcon={item.icon}
                                                items={subItem.items}
                                            />
                                        ))
                                    ) : (
                                        <Button
                                            key={item.linkPath}
                                            as="li"
                                            size='lg'
                                            fullWidth
                                            variant='light'
                                            color='primary'
                                            onPress={() => router.push(item.linkPath)}
                                            className={pathname === item.linkPath || pathname.includes(item.linkPath) ? 'sidemenu__item--active' : 'sidemenu__item'}
                                            startContent={item.icon || null}
                                        >
                                            {item.label}
                                        </Button>
                                    )}
                                </div>
                            )))
                        }
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
