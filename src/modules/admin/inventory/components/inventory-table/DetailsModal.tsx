"use client"
import {
    Button, Modal, ModalBody, ModalContent,
    ModalFooter, ModalHeader, Spinner,
    Table, TableBody, TableCell, TableColumn,
    TableHeader, TableRow, Tooltip, useDisclosure
} from '@heroui/react'
import React, { useState } from 'react'
import { IMovementDetail, IMovement } from '@/modules/admin/inventory'
import { AlignBoxBottomLeftIcon } from 'hugeicons-react'

interface Props {
    movement: IMovement;
}

export const DetailsModal = ({ movement }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const showOrigin = movement.movementType === 'TRANSFER' || movement.movementType === 'OUTCOME' || movement.adjustment?.adjustmentType === 'OUTCOME';
    const showDestination = movement.movementType === 'INCOME' || movement.movementType === 'TRANSFER' || movement.adjustment?.adjustmentType === 'INCOME';

    const nameDestination = movement.destinationWarehouse || movement.destinationBranch || null;
    const nameOrigin = movement.originWarehouse || movement.originBranch || null;

    const renderRow = (item: IMovementDetail) => {
        const cells = [
            <TableCell key="name">{item.product?.name || "Sin nombre"}</TableCell>,
            <TableCell key="expected">{item.totalExpectedQuantity}</TableCell>,
            <TableCell key="delivered">{item.totalDeliveredQuantity || 0}</TableCell>,
            <TableCell key="unit">{item.unit || "N/A"}</TableCell>,
        ];

        // if (showOrigin) {
        //     cells.push(
        //         <TableCell key="origin">{nameOrigin?.name || 'N/A'}</TableCell>
        //     );
        // }

        // if (showDestination) {
        //     cells.push(
        //         <TableCell key="destination">{nameDestination?.name || 'N/A'}</TableCell>
        //     );
        // }

        return <TableRow key={item.id}>{cells}</TableRow>;
    };

    const tableColumns = [
        <TableColumn key="producto">PRODUCTO</TableColumn>,
        <TableColumn key="esperada">C. ESPERADA</TableColumn>,
        <TableColumn key="entregada">C. ENTREGADA</TableColumn>,
        <TableColumn key="unidad">U. MEDIDA</TableColumn>,
    ];

    // if (showOrigin) tableColumns.push(<TableColumn key="origen">ORIGEN</TableColumn>);
    // if (showDestination) tableColumns.push(<TableColumn key="destino">DESTINO</TableColumn>);

    return (
        <>
            <Tooltip color="primary" content="Ver detalles" delay={1000}>
                <Button
                    color="primary"
                    onPress={onOpen}
                    variant="light"
                    isIconOnly
                    radius="full"
                    startContent={<AlignBoxBottomLeftIcon />}
                />
            </Tooltip>

            <Modal isOpen={isOpen} size="4xl" onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {`Detalles de Movimiento de ${movement.movementType === 'INCOME' ? 'Entrada' : 'Salida'}`}
                            </ModalHeader>
                            <ModalBody>
                                {(showOrigin || showDestination) && (
                                    <div className="space-y-1 text-sm text-default-600">
                                        {showOrigin && (
                                            <div><strong>Origen:</strong> {nameOrigin?.name || 'N/A'}</div>
                                        )}
                                        {showDestination && (
                                            <div><strong>Destino:</strong> {nameDestination?.name || 'N/A'}</div>
                                        )}
                                    </div>
                                )}
                                <Table aria-label="Lista de stock">
                                    <TableHeader>
                                        {tableColumns}
                                    </TableHeader>
                                    <TableBody
                                        loadingContent={<Spinner />}
                                        loadingState={isLoading ? 'loading' : 'filtering'}
                                        emptyContent="¡Ups! No encontramos nada aquí."
                                        items={movement.inventoryMovementDetails}
                                    >
                                        {(item) => renderRow(item)}
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
    );
};
