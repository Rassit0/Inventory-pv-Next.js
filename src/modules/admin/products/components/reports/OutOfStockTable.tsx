"use client"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import React from 'react'
import { IOutOfStock } from '@/modules/admin/products'

interface Props{
    response: IOutOfStock;
}

export const OutOfStockTable = ({response}:Props) => {
    return (
        <section className='container pt-2'>
            <Table aria-label="Out of Stock Table">
                <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>STOCK</TableColumn>
                    <TableColumn>UNIDAD</TableColumn>
                </TableHeader>
                <TableBody>
                    {
                        response.products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.unit.name}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </section>
    )
}
