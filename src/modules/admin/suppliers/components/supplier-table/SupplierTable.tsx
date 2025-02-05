"use client"

import React from 'react'
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { ISupplier, SupplierDetailsModal, UpdateSupplierFormModal } from '@/modules/admin/suppliers';
import { DeleteSupplierModal } from '../DeleteSupplierModal';

interface Props {
    suppliers: ISupplier[];
}

export const SupplierTable = ({ suppliers }: Props) => {
    return (
        <section className='container pt-8'>
            <Table
                aria-label='Lista de proveedores'
                selectionMode='single'
            >
                <TableHeader>
                    <TableColumn>PROVEEDOR</TableColumn>
                    <TableColumn>UBICACIÓN</TableColumn>
                    <TableColumn>CONTACTO PRINCIPAL</TableColumn>
                    <TableColumn>TELÉFONO</TableColumn>
                    <TableColumn>CORREO</TableColumn>
                    <TableColumn>ESTADO</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"¡Ups! No encontramos nada aquí."}>
                    {suppliers
                        .filter(supplier => !supplier.deletedAt) // Exluye los eliminados
                        .map((supplier) => {
                            const primaryContact = supplier.contactInfo.find((contact) => contact.isPrimary) || supplier.contactInfo[0]

                            return (
                                <TableRow key={supplier.id}>
                                    <TableCell>{supplier.name}</TableCell>
                                    <TableCell>{`${supplier.city}, ${supplier.country}`}</TableCell>
                                    <TableCell>{primaryContact?.contactName || 'N/A'}</TableCell>
                                    <TableCell>{primaryContact?.phoneNumber || 'N/A'}</TableCell>
                                    <TableCell>{primaryContact?.email || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip color={supplier.isActive ? 'success' : 'danger'} size='sm' variant='flat'>
                                            {supplier.isActive ? 'Activo' : 'Inactivo'}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex">
                                            <SupplierDetailsModal supplier={supplier} />
                                            <UpdateSupplierFormModal supplier={supplier} />
                                            <DeleteSupplierModal supplierId={supplier.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                </TableBody>
            </Table>
        </section>
    )
}
