"use client"
import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@heroui/react'
import React, { FormEvent, useState } from 'react'
import { toast } from 'sonner';
import { changeStatusMovement } from '../../actions/change-status-movement';
import { ConfirmQuantities, IMovement } from '@/modules/admin/inventory';

interface Props {
    colorButton: "warning" | "success" | "danger" | "primary" | "default" | "secondary" | undefined
    title: string;
    movement: IMovement;
    token: string;
}

export const ChangeStatusModal = ({ colorButton, title, movement, token }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(movement.status as string);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await changeStatusMovement({ formData, transactionId: movement.id, token });
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

        // Se se guarda con éxito
        toast.success(message);
        setIsLoading(false);

        onClose();
    }
    return (
        <>
            <Button color={colorButton} onPress={onOpen} isDisabled={movement.status === 'COMPLETED' || movement.status === 'CANCELED'}
                size='sm' variant='ghost'
            >
                {title}
            </Button>

            <Modal isOpen={isOpen} size='5xl' onClose={onClose}>
                <Form
                    validationBehavior='native'
                    onSubmit={handleSubmit}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Estado de los detalles</ModalHeader>
                                <ModalBody>
                                    <p>¿Está seguro de cambiar el estado de la transacción?</p>
                                    <Select
                                        isRequired
                                        name='statusTransaction'
                                        color='warning'
                                        variant='flat'
                                        selectedKeys={[selectedStatus]}
                                        onSelectionChange={(key) => setSelectedStatus(key.currentKey || '')}
                                        placeholder='Seleccione el estado'
                                        label='Estado'
                                    >
                                        <SelectItem key={'PENDING'}>Pendiente</SelectItem>
                                        {/* <SelectItem key={'ACCEPTED'}>Aceptado</SelectItem> */}
                                        <SelectItem key={'CANCELED'}>Cancelado</SelectItem>
                                        <SelectItem key={'COMPLETED'}>Completado</SelectItem>
                                    </Select>

                                    <ConfirmQuantities details={movement.inventoryMovementDetails} />

                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cancelar
                                    </Button>
                                    <Button type='submit' color="primary" onPress={onClose}>
                                        Actualizar
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Form>
            </Modal>
        </>
    )
}
