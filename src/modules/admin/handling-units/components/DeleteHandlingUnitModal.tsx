import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import React, { useState } from 'react'
import { deleteHandlingUnit } from '@/modules/admin/handling-units';
import { toast } from 'sonner';
import { Delete01Icon } from 'hugeicons-react';

interface Props {
    unitId: string
}

export const DeleteHandlingUnitModal = ({ unitId }: Props) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        // SERVER ACTION
        const { error, message } = await deleteHandlingUnit(unitId);
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
                onPress={onOpen}
                isIconOnly
                color='danger'
                radius='full'
                variant='light'
                startContent={<Delete01Icon />}
            />

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Eliminar Unidad de Manejo</ModalHeader>
                            <ModalBody>
                            <p>¿Está seguro de eliminar la unidad de manejo?</p>
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
