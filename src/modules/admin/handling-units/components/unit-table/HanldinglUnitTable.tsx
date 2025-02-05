"use client"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import React from 'react'
import { IHandlingUnitResponse } from '@/modules/admin/handling-units'
import { UpdateHanldingUnitModalForm } from '../UpdateHanldingUnitModalForm'
import { DeleteHandlingUnitModal } from '../DeleteHandlingUnitModal'

export const HanldinglUnitTable = ({ units }: IHandlingUnitResponse) => {
    return (
        <section className='container pt-8'>
            <Table
                aria-label='Lista de unidades'
                selectionMode='single'
            >
                <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>ABREVIACIÓN</TableColumn>
                    <TableColumn>CREADO</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                </TableHeader>

                <TableBody emptyContent={"¡Ups! No encontramos nada aquí."}>
                    {
                        units.map(unit => (
                            <TableRow key={unit.id}>
                                <TableCell>{unit.name}</TableCell>
                                <TableCell>{unit.abbreviation}</TableCell>
                                <TableCell>{unit.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="flex">
                                        <UpdateHanldingUnitModalForm unit={unit} />
                                        <DeleteHandlingUnitModal unitId={unit.id} />
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
