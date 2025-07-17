"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { AlignBoxBottomLeftIcon, BoundingBoxIcon, FolderDetailsIcon, StrokeCenterIcon } from 'hugeicons-react';
import { IProduct } from '../interfaces/products-response';

interface Props {
    product: IProduct;
}

export const DetailsStockModal = ({ product }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);


    // const renderRow = (item: InventoryTransactionProduct, type: string) => {
    //     const stock = type === "branch" ? item.branchStock : item.warehouseStock;
    //     const name = type === "branch" ? stock?.branch?.name : stock?.warehouse?.name;
    //     const nameOrigin = stock?.originBranch ? stock?.originBranch?.name : stock?.originWarehouse ? stock?.originWarehouse?.name : null;

    //     return (
    //         <TableRow key={`${type}-${String(item.id)}`}>
    //             <TableCell>{item.product?.name || "Sin nombre"}</TableCell>
    //             <TableCell>{stock?.quantity || 0}</TableCell>
    //             <TableCell>{item.unit || "N/A"}</TableCell>
    //             {<TableCell hidden={transaction.movementType !== 'TRANSFER'}>{nameOrigin || "N/A"}</TableCell>}
    //             <TableCell>{name || "N/A"}</TableCell>
    //         </TableRow>
    //     );
    // };


    return (
        <>
            <Tooltip color="primary" content="Ver detalles de stock" delay={1000}>
                <Button
                    color={'primary'}
                    onPress={onOpen}
                    variant='light'
                    isIconOnly
                    radius='full'
                    // size='sm'
                    startContent={<AlignBoxBottomLeftIcon />}
                />
            </Tooltip >

            <Modal isOpen={isOpen} size='4xl' onClose={onClose} scrollBehavior='outside'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{
                                `Detalles de Stock de ${product.name}`
                            }</ModalHeader>
                            <ModalBody className='w-full h-full'>
                                <h1 className='font-semibold text-md pl-4 pb-0 text-default-600'>Stock por Sucursales</h1>
                                <Table
                                    aria-label='Lista de stock'
                                >
                                    <TableHeader>
                                        <TableColumn>STOCK</TableColumn>
                                        <TableColumn>U. MEDIDA</TableColumn>
                                        <TableColumn>SUCURSAL</TableColumn>
                                    </TableHeader>

                                    <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'filtering'} emptyContent={"¡Ups! No encontramos nada aquí."}
                                        items={product.locationProductStock.filter(item => item.locationType === "BRANCH")}
                                    >
                                        {(item) => (
                                            <TableRow>
                                                <TableCell>{item.stock}</TableCell>
                                                <TableCell>{product.unit.name}</TableCell>
                                                <TableCell>{item.branch?.name || "N/A"}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <h1 className='font-semibold text-md pl-4 pb-0 text-default-600'>Stock por Almacenes</h1>
                                <Table
                                    aria-label='Lista de stock por almacén'
                                >
                                    <TableHeader>
                                        <TableColumn>STOCK</TableColumn>
                                        <TableColumn>U. MEDIDA</TableColumn>
                                        <TableColumn>ALMACÉN</TableColumn>
                                    </TableHeader>

                                    <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'filtering'} emptyContent={"¡Ups! No encontramos nada aquí."}
                                        items={product.locationProductStock.filter(item => item.locationType === "WAREHOUSE")
                                        }
                                    >
                                        {(item) => (
                                            <TableRow>
                                                <TableCell>{item.stock}</TableCell>
                                                <TableCell>{product.unit.name}</TableCell>
                                                <TableCell>{item.warehouse?.name || "N/A"}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
