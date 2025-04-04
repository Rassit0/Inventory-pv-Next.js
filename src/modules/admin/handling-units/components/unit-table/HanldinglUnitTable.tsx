"use client"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import React from 'react'
import { ISimpleHandlingUnit } from '@/modules/admin/handling-units'
import { UpdateHanldingUnitModalForm } from '../UpdateHanldingUnitModalForm'
import { DeleteHandlingUnitModal } from '../DeleteHandlingUnitModal'


interface Props {
    editUnit: boolean;
    deleteUnit: boolean;
    units: ISimpleHandlingUnit[];
    token: string;
}

export const HanldinglUnitTable = ({ deleteUnit, editUnit, units, token }: Props) => {
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
                    <TableColumn hideHeader={!deleteUnit && !editUnit}>ACCIONES</TableColumn>
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
                                        {editUnit && (<UpdateHanldingUnitModalForm unit={unit} token={token} />)}
                                        {deleteUnit && (<DeleteHandlingUnitModal unitId={unit.id} token={token} />)}
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
