"use client"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import React from 'react'
import { IHighDemand } from '@/modules/admin/products'

interface Props{
    response: IHighDemand;
}

export const HighDemandTable = ({response}:Props) => {
    return (
        <section className='container pt-2'>
            <Table aria-label="High Demand Table">
                <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>STOCK</TableColumn>
                    <TableColumn>Ultima Venta</TableColumn>
                </TableHeader>
                <TableBody>
                    {
                        response.products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.lastSaleDate.toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </section>
    )
}
