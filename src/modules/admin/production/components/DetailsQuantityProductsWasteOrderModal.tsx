"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure, Spinner } from '@heroui/react'
import React, { useState } from 'react'
import { ViewIcon } from 'hugeicons-react';
import { IProductionWaste } from '@/modules/admin/production';

interface Props {
    productionWaste: IProductionWaste[];
}

export const DetailsQuantityProductsWasteOrderModal = ({ productionWaste }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);


    // Calcular la cantidad total de productos necesarios por receta
    // const calculateProductQuantities = () => {
    //     if (!recipe || !recipe.items) return [];
    //     return recipe.items.map((item: IProductionDetailRecipeItem) => {
    //         const totalQuantity = parseFloat(item.quantity) * recipeCount;  // Multiplicamos por la cantidad de recetas
    //         return {
    //             ...item,
    //             totalQuantity: totalQuantity.toFixed(2), // Redondeamos a dos decimales
    //         };
    //     });
    // };

    // const productQuantities = calculateProductQuantities();

    return (
        <>
            {/* <Tooltip color="primary" content="Ver detalles de desperdicio" delay={1000}> */}
            <Button
                color={'primary'}
                onPress={onOpen}
                variant='solid'
                radius='full'
                startContent={<ViewIcon />}
            >
                Ver Desperdicios
            </Button>
            {/* </Tooltip> */}

            <Modal isOpen={isOpen} size='4xl' onClose={onClose} scrollBehavior='outside'>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold">Detalles de desperdicios</h2>
                    </ModalHeader>
                    <ModalBody className='w-full h-full'>
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <Spinner size="lg" color="primary" />
                            </div>
                        ) : (
                            <>


                                {/* Tabla con los productos necesarios */}
                                <Table aria-label="Detalles de los productos por receta">
                                    <TableHeader>
                                        <TableColumn>Producto</TableColumn>
                                        <TableColumn>Cantidad desperdiciada</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="No hay productos desperdiciados.">
                                        {productionWaste.map(waste => (
                                            <TableRow key={waste.id}>
                                                <TableCell>{waste.product.name}</TableCell>
                                                <TableCell>{`${waste.quantity} ${waste.product.unit.abbreviation}`}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={onClose}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
