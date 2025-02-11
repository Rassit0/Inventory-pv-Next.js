"use client"
import React from 'react'
import { IUserRole } from '@/modules/admin/user-roles'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'

interface Props {
    roles: IUserRole[]
}

export const UserRolesTable = ({ roles }: Props) => {
    return (
        <section className='container pt-8'>
            <Table
                aria-label='List User Roles'
                selectionMode='single'
            >
                <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>DESCRIPCION</TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={"¡Ups! No encontramos nada aquí."}
                >
                    {
                        roles.map(role => (
                            <TableRow key={role.id}>
                                <TableCell>{role.name}</TableCell>
                                <TableCell className={role.description?'':'text-default-400'}>{role.description||'N/A'}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </section>
    )
}
