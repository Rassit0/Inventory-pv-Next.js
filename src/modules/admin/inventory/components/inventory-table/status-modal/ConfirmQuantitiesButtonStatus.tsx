"use client"
import { Button, DropdownItem, DropdownMenu, DropdownTrigger, Dropdown } from '@heroui/react';
import React, { useState } from 'react'
import { EDeliveryStatusDetail } from '@/modules/admin/inventory';
import { PencilEdit01Icon } from 'hugeicons-react';

interface Props{
    defaultValue?: EDeliveryStatusDetail;
}
export const ConfirmQuantitiesButtonStatus = ({defaultValue}:Props) => {
    const [selectedDeliveryStatus, setselectedDeliveryStatus] = useState<EDeliveryStatusDetail>(defaultValue || EDeliveryStatusDetail.PENDING); // Estado inicial del botón

    const deliveryStatusMap = {
        'PENDING': 'Pendiente', // Pendiente de entrega
        'COMPLETE': 'Completo', // Entregado completamente
        'PARTIAL': 'Parcial', // Entregado parcialmente
        'NOT_DELIVERED': 'No entregado', // No entregado
        'OVER_DELIVERED': 'Exceso', // Entregado en exceso
    };

    const deliveryStatusColors: Record<EDeliveryStatusDetail, "default" | "success" | "warning" | "danger" | "primary" | "secondary" | undefined> = {
        PENDING: 'warning', // Color para pendiente
        COMPLETE: 'success', // Color para completo
        PARTIAL: 'primary', // Color para parcial
        NOT_DELIVERED: 'danger', // Color para no entregado
        OVER_DELIVERED: 'default', // Color para exceso
    };
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    className='w-full flex justify-between'
                    variant="solid"
                    color={deliveryStatusColors[selectedDeliveryStatus] ?? 'default'}
                    endContent={<PencilEdit01Icon />}
                >
                    {deliveryStatusMap[selectedDeliveryStatus] || 'Seleccionar'}
                </Button>

            </DropdownTrigger>
            <DropdownMenu
                aria-label="Estado de entrega"
                onAction={(key) => setselectedDeliveryStatus(key as EDeliveryStatusDetail)} // Actualizar el estado al seleccionar
            // onSelectionChange={(key) => handleDeliveryStatusChange(item.id, key.currentKey as EDeliveryStatusDetail)} // Actualizar el estado al seleccionar
            >
                <DropdownItem key="PENDING">Entrega pendiente</DropdownItem>
                <DropdownItem key="COMPLETE">Entregado completamente</DropdownItem>
                <DropdownItem key="PARTIAL">Entregado parcialmente</DropdownItem>
                <DropdownItem key="NOT_DELIVERED">No entregado</DropdownItem>
                <DropdownItem key="OVER_DELIVERED">Entregado en exceso</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
