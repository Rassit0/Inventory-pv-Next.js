"use client"
import React, { useEffect, useState } from 'react'
import { IWarehouse } from '@/modules/admin/warehouses'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png'

interface Props {
    warehouses: IWarehouse[];
}


type ImageErrors = {
    [key: string]: boolean;
}

export const WarehouseTable = ({ warehouses }: Props) => {

    const [imageErrors, setImageErrors] = useState<ImageErrors>({});
    useEffect(() => {
        setImageErrors({});
    }, [warehouses])

    const handleImageError = (warehouseId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [warehouseId]: true,
        }));
    };



    return (
        <section className='container pt-8'>
            <Table
                aria-label='Lista de almacenes'
                selectionMode='single'
            >
                <TableHeader>
                    <TableColumn>IMAGEN</TableColumn>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>UBICACIÓN</TableColumn>
                    <TableColumn>SUCURSAL</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                </TableHeader>

                <TableBody emptyContent={"¡Ups! No encontramos nada aquí."}>
                    {warehouses.map(warehouse => (
                        <TableRow key={warehouse.id}>
                            <TableCell>
                                <div className='w-full h-16 flex items-center justify-center'>
                                    <Image
                                        alt={warehouse.name}
                                        src={imageErrors[warehouse.id] ? warning_error_image : warehouse.imageUrl || no_image}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className='object-contain'
                                        priority={warehouse.imageUrl ? false : true}
                                        onError={() => handleImageError(warehouse.id)}
                                    />
                                </div>
                            </TableCell>
                            <TableCell>{warehouse.name}</TableCell>
                            <TableCell>{warehouse.location}</TableCell>
                            <TableCell>{warehouse.branches.map(branch => branch.details.name).join(', ')}</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    )
}
