"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from '@heroui/react'
import React, { useState } from 'react'
import { InventoryTransactionProduct, ITransaction } from '@/modules/admin/inventory';
import { AlignBoxBottomLeftIcon, BoundingBoxIcon, FolderDetailsIcon, StrokeCenterIcon } from 'hugeicons-react';

interface Props {
    transaction: ITransaction;
}

export const DetailsModal = ({ transaction }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const renderRow = (item: InventoryTransactionProduct, type: string) => {
        const stock = type === "branch" ? item.branchStock : item.warehouseStock;
        const name = type === "branch" ? stock?.branch?.name : stock?.warehouse?.name;
        const nameOrigin = stock?.originBranch ? stock?.originBranch?.name : stock?.originWarehouse ? stock?.originWarehouse?.name : null;

        return (
            <TableRow key={`${type}-${String(item.id)}`}>
                <TableCell>{item.product?.name || "Sin nombre"}</TableCell>
                <TableCell>{stock?.quantity || 0}</TableCell>
                <TableCell>{item.unit || "N/A"}</TableCell>
                {<TableCell hidden={transaction.movementType !== 'TRANSFER'}>{nameOrigin || "N/A"}</TableCell>}
                <TableCell>{name || "N/A"}</TableCell>
            </TableRow>
        );
    };


    return (
        <>
            <Tooltip color="primary" content="Ver detalles" delay={1000}>
                <Button
                    color={'primary'}
                    onPress={onOpen}
                    variant='light'
                    isIconOnly
                    radius='full'
                    startContent={<AlignBoxBottomLeftIcon />}
                />
            </Tooltip >

            <Modal isOpen={isOpen} size='4xl' onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{
                                `Detalles de Transacción de ${transaction.movementType === 'INCOME' ? 'Entrada' : 'Salida'}`
                            }</ModalHeader>
                            <ModalBody>
                                <Table
                                    aria-label='Lista de stock'
                                >
                                    <TableHeader>
                                        <TableColumn>PRODUCTO</TableColumn>
                                        <TableColumn>CANTIDAD</TableColumn>
                                        <TableColumn>U. MEDIDA</TableColumn>
                                        <TableColumn hidden={transaction.movementType !== 'TRANSFER'}>ORIGEN</TableColumn>
                                        <TableColumn>{
                                            transaction.movementType === 'INCOME' ||
                                                transaction.movementType === 'TRANSFER' ||
                                                transaction.movementType === 'ADJUSTMENT' ? 'DESTINO' : 'SUCURSAL'
                                            // transaction.movementType==='OUTCOME'?'SUCURSAL':
                                            // transaction.movementType==='OUTCOME'?'SUCURSAL':
                                        }</TableColumn>
                                    </TableHeader>

                                    <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'filtering'} emptyContent={"¡Ups! No encontramos nada aquí."}
                                        items={transaction.inventoryTransactionProducts.map(i => {
                                            // Si existen tanto branchStock como warehouseStock, duplicamos el item
                                            if (i.branchStock && i.warehouseStock) {
                                                return [
                                                    // Primer item con branchStock null y warehouseStock como objeto
                                                    {
                                                        ...i,
                                                        branchStock: null,
                                                        warehouseStock: i.warehouseStock,
                                                    },
                                                    // Segundo item con warehouseStock null y branchStock como objeto
                                                    {
                                                        ...i,
                                                        branchStock: i.branchStock,
                                                        warehouseStock: null,
                                                    }
                                                ];
                                            }

                                            // Si solo existe branchStock o warehouseStock, devolvemos el item tal cual
                                            return [i];
                                        }).flat()}
                                    >
                                        {(item) => {
                                            if (item.branchStock) {
                                                return renderRow(item, "branch")
                                            }
                                            if (item.warehouseStock) {
                                                return renderRow(item, "warehouse")
                                            }
                                            return <></>;
                                        }}
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
