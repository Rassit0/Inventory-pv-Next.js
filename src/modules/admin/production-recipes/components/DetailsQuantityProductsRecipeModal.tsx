"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure, Spinner } from '@heroui/react'
import React, { useState } from 'react'
import { AlignBoxBottomLeftIcon } from 'hugeicons-react';
import { IRecipe, IRecipeItem } from '@/modules/admin/production-recipes';

interface Props {
    recipe: IRecipe;
    recipeCount: number;  // Cantidad de recetas a preparar
}

export const DetailsQuantityProductsRecipeModal = ({ recipe, recipeCount }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    // Calcular la cantidad total de productos necesarios por receta
    const calculateProductQuantities = () => {
        return recipe.items.map((item: IRecipeItem) => {
            const totalQuantity = parseFloat(item.quantity) * recipeCount;  // Multiplicamos por la cantidad de recetas
            return {
                ...item,
                totalQuantity: totalQuantity.toFixed(2), // Redondeamos a dos decimales
            };
        });
    };

    const productQuantities = calculateProductQuantities();

    return (
        <>
            <Tooltip color="primary" content="Ver detalles de stock" delay={1000}>
                <Button
                    color={'primary'}
                    onPress={onOpen}
                    variant='light'
                    isIconOnly
                    radius='full'
                    startContent={<AlignBoxBottomLeftIcon />}
                />
            </Tooltip>

            <Modal isOpen={isOpen} size='4xl' onClose={onClose} scrollBehavior='outside'>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold">Detalles de la receta</h2>
                        <span className="text-sm text-gray-500">
                            Cantidad de recetas a preparar: {recipeCount}
                        </span>
                    </ModalHeader>
                    <ModalBody className='w-full h-full'>
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <Spinner size="lg" color="primary" />
                            </div>
                        ) : (
                            <>
                                {/* Detalles adicionales */}
                                <div className="mb-3">
                                    {/* <h3 className="text-lg font-semibold">Detalles de la receta</h3> */}
                                    <p>
                                        <strong>Nombre:</strong> {recipe.name}
                                    </p>
                                    <p>
                                        <strong>Descripción:</strong> {recipe.description}
                                    </p>
                                    {/* <p>
                                        <strong>Tiempo de preparación:</strong> {recipe.preparationTime} minutos
                                    </p> */}
                                </div>

                                {/* Tabla con los productos necesarios */}
                                <Table aria-label="Detalles de los productos por receta">
                                    <TableHeader>
                                        <TableColumn>Producto</TableColumn>
                                        <TableColumn>Cantidad por receta</TableColumn>
                                        <TableColumn>Total necesario</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {productQuantities.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.product.name}</TableCell>
                                                <TableCell>{`${item.quantity} ${item.product.unit.abbreviation}`}</TableCell>
                                                <TableCell>{`${item.totalQuantity} ${item.product.unit.abbreviation}`}</TableCell>
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
