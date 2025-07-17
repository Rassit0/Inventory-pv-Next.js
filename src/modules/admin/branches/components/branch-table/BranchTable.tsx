"use client"

import React, { useEffect, useState } from 'react'
import { DeleteBranchModal, IBranch, UpdateBranchFormModal } from '@/modules/admin/branches'
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import Image from 'next/image';
import { IUser } from '@/modules/admin/users';

interface Props {
    editBranch: boolean;
    deleteBranch: boolean;
    branches: IBranch[];
    users: IUser[];
    token: string;
}

type ImageErrors = {
    [key: string]: boolean;
}

export const BranchTable = ({ token, deleteBranch, editBranch, branches, users }: Props) => {
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
                    <TableColumn>CREACIÓN</TableColumn>
                    <TableColumn hideHeader={!deleteBranch && !editBranch}>ACCIONES</TableColumn>
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
                                <TableCell>{branch.phone || <div className='text-default-400'>N/A</div>}</TableCell>
                                <TableCell>{branch.email || <div className='text-default-400'>N/A</div>}</TableCell>
                                <TableCell>{branch.manager ? branch.manager.email : <div className='text-default-400'>N/A</div>}</TableCell>
                                <TableCell>{branch.createdaAt.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex">
                                        {editBranch && (<UpdateBranchFormModal token={token} branch={branch} users={users} />)}
                                        {deleteBranch && (<DeleteBranchModal branchId={branch.id} token={token} />)}
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
