"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import React, { useState } from 'react'
import { deleteContact } from '@/modules/admin/suppliers';
import { toast } from 'sonner';
import { Delete01Icon } from 'hugeicons-react';

interface Props {
    contactId: number,
    onDelete: (id: number) => void; // Recibe una funcion
}

export const DeleteContact = ({ contactId, onDelete }: Props) => {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        if (contactId > 0) {
            // SERVER ACTION
            const { error, message, response } = await deleteContact(contactId);
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
                onClose();
                return;
            }
            toast.success(message);
        } else {
            toast.success("Se eliminó el contacto");
        }


        setIsLoading(false);
        onClose();

        onDelete(contactId);
        return;
    }

    return (
        <>
            <Button
                onPress={onOpen}
                isIconOnly
                radius='full'
                size='sm'
                color='danger'
                className='mt-4'
                startContent={<Delete01Icon />}
            // onPress={() => handleRemoveContactForm(contact.id)}
            />

            <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClosee) => (
                        <>
                            <ModalHeader>Eliminar contacto</ModalHeader>
                            <ModalBody>
                                <p>¿Está seguro de eliminar el contacto?</p>
                            </ModalBody>

                            <ModalFooter>
                                <Button color='danger' variant='light' onPress={onClose}>Cancelar</Button>
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
