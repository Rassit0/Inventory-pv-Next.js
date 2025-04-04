"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Delete01Icon } from 'hugeicons-react';
import { deleteRecipe } from '@/modules/admin/production-recipes';

interface Props {
    recipeId: string,
    recipeName: string;
    token: string;
    onPress?: () => void;  // Nueva prop onPress 
    onCloseModal?: () => void;  // Nueva prop onPress
}

export const DeleteRecipeModal = ({ recipeId, token, recipeName, onPress, onCloseModal }: Props) => {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true);

        // SERVER ACTION
        const { error, message } = await deleteRecipe({ id: recipeId, token });

        if (error) {
            toast.error("Ocurrio un error", {
                description: message
            })
            setIsLoading(false);
            onClose();
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
                onPress={() => {
                    onOpen();  // Abre el modal
                    if (onPress) onPress();  // Ejecuta la función onPress
                }}
                // isIconOnly
                color='danger'
                // radius='full'
                variant='light'
                className='w-full flex justify-start'
                startContent={<Delete01Icon />}
            >Elimiinar</Button>

            <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onCloseModal}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Eliminar Receta</ModalHeader>
                            <ModalBody>
                                <p>¿Está seguro de eliminar la receta {recipeName}?</p>
                            </ModalBody>

                            <ModalFooter>
                                <Button color='danger' variant='light'
                                    onPress={() => {
                                        onClose();
                                        if (onCloseModal) onCloseModal();
                                    }}
                                >Cancelar</Button>
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
