"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { Delete01Icon } from 'hugeicons-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { deleteWarehouse } from '../actions/delete-warehouse';

interface Props {
    warehouseId: string;
    token: string;
}

export const DeleteWarehouseModal = ({ warehouseId, token }: Props) => {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        // SERVER ACTION
        const { error, message, response } = await deleteWarehouse({id:warehouseId, token});

        if (error) {
            if (response && Array.isArray(response.message)) {
                // Itera sobre cada mensaje en response.message y muestra un toast para cada uno
                response.message.forEach((msg: string) => {  // Aquí se define el tipo de 'msg'
                    toast.warning("Ocurrió un error", {
                        description: msg
                    });
                });
            } else {
                // Si no es un arreglo, muestra un solo toast con el mensaje
                toast.warning("Ocurrió un error", {
                    description: response ? response.message : message
                });
            }

            setIsLoading(false);
            return;
        }

        toast.success(message);
        setIsLoading(false);
        onClose();
        return;
    }
    return (
        <>
            <Button
                onPress={onOpen}
                isIconOnly
                color='danger'
                radius='full'
                variant='light'
                startContent={<Delete01Icon />}
            />

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='outside' placement='top'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Eliminar Almacén</ModalHeader>
                            <ModalBody>
                                <p>¿Está seguro de eliminar el almacén?</p>
                            </ModalBody>

                            <ModalFooter>
                                <Button color='danger' variant='light' onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color='primary'
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                    onPress={handleSubmit}
                                >
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
