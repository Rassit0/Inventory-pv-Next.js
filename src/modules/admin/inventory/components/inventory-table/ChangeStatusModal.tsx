"use client"
import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@heroui/react'
import React, { FormEvent, useState } from 'react'
import { toast } from 'sonner';
import { changeStatusTransaction } from '../../actions/change-status-transaction';
import { ITransaction } from '@/modules/admin/inventory';

interface Props {
    colorButton: "warning" | "success" | "danger" | "primary" | "default" | "secondary" | undefined
    title: string;
    transaction: ITransaction;
    token: string;
}

export const ChangeStatusModal = ({ colorButton, title, transaction, token }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await changeStatusTransaction({ formData, transactionId: transaction.id, token });
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
            <Button color={colorButton} onPress={onOpen} isDisabled={transaction.status==='COMPLETED'||transaction.status==='CANCELED'}
                size='sm' variant='ghost'
            >
                {title}
            </Button>

            <Modal isOpen={isOpen} size='xl' onClose={onClose}>
                <Form
                    validationBehavior='native'
                    onSubmit={handleSubmit}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                                <ModalBody>
                                    <p>¿Está seguro de cambiar el estado de la transacción?</p>
                                    <Select
                                        isRequired
                                        name='statusTransaction'
                                        variant='underlined'
                                        defaultSelectedKeys={[transaction.status]}
                                        placeholder='Seleccione el estado'
                                        label='Estado'
                                    >
                                        <SelectItem key={'PENDING'}>Pendiente</SelectItem>
                                        {/* <SelectItem key={'ACCEPTED'}>Aceptado</SelectItem> */}
                                        <SelectItem key={'CANCELED'}>Cancelado</SelectItem>
                                        <SelectItem key={'COMPLETED'}>Completado</SelectItem>
                                    </Select>
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
