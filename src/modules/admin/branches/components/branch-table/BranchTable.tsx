"use client"

import React, { useEffect, useState } from 'react'
import { DeleteBranchModal, IBranch, UpdateBranchFormModal } from '@/modules/admin/branches'
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import Image from 'next/image';
import { IUser } from '@/modules/admin/users';

interface Props {
    branches: IBranch[];
    users: IUser[];
}

type ImageErrors = {
    [key: string]: boolean;
}

export const BranchTable = ({ branches, users }: Props) => {
    const [imageErrors, setImageErrors] = useState<ImageErrors>({})
    useEffect(() => {
        setImageErrors({});
    }, [branches]);

    const handleImageError = (branchId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [branchId]: true,
        }));
    };

    return (
        <section className='container pt-8'>
            <Table
                aria-label='Lista de sucursales'
                selectionMode='single'
            >
                <TableHeader>
                    <TableColumn>IMAGEN</TableColumn>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>UBICACIÓN</TableColumn>
                    <TableColumn>TELÉFONO</TableColumn>
                    <TableColumn>CORREO</TableColumn>
                    <TableColumn>GERENTE</TableColumn>
                    <TableColumn>LATITUD</TableColumn>
                    <TableColumn>LONGITUD</TableColumn>
                    <TableColumn>CREACIÓN</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"¡Ups! No encontramos nada aquí."}>
                    {
                        branches.map(branch => (
                            <TableRow key={branch.id}>
                                <TableCell>
                                    <div className='w-full h-16 flex items-center justify-center'>
                                        <Image
                                            alt={branch.name}
                                            src={imageErrors[branch.id] ? warning_error_image : branch.imageUrl || no_image}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className='object-contain'
                                            priority={branch.imageUrl ? false : true}
                                            onError={() => handleImageError(branch.id)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>{branch.name}</TableCell>
                                <TableCell>{branch.location}</TableCell>
                                <TableCell>{branch.phone}</TableCell>
                                <TableCell>{branch.email}</TableCell>
                                <TableCell>{branch.managerId}</TableCell>
                                <TableCell>{branch.latitude}</TableCell>
                                <TableCell>{branch.longitude}</TableCell>
                                <TableCell>{branch.createdaAt.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex">
                                        <UpdateBranchFormModal branch={branch} users={users} />
                                        <DeleteBranchModal branchId={branch.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </section>
    )
}
