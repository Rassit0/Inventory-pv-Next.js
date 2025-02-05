"use client"
import React, { FormEvent, useState } from 'react'
import { ISimpleHandlingUnit } from '../interfaces/simple-hanlding-unit'
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { updateHandlingUnit } from '@/modules/admin/handling-units';
import { toast } from 'sonner';
import { PencilEdit01Icon } from 'hugeicons-react';

interface Props {
    unit: ISimpleHandlingUnit
}

export const UpdateHanldingUnitModalForm = ({ unit }: Props) => {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await updateHandlingUnit(formData, unit.id);
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
            <Button
                onPress={onOpen}
                isIconOnly
                color='primary'
                variant='light'
                radius='full'
                startContent={<PencilEdit01Icon />}
            />
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='outside' placement='top'>
                <ModalContent>
                    {(onClose) => (
                        <Form
                            validationBehavior='native'
                            onSubmit={handleSubmit}
                        >
                            <ModalHeader>Editar Unidad de Manejo</ModalHeader>

                            <ModalBody className='w-full'>
                                <Input
                                    isRequired
                                    name='unitName'
                                    label='Nombre'
                                    placeholder='Agrega un nombre a la unidad'
                                    variant='underlined'
                                    defaultValue={unit.name}
                                />

                                <Input
                                    isRequired
                                    name='unitAbbreviation'
                                    label="Abreviación"
                                    placeholder="Agrega una abreviación a la unidad"
                                    variant='underlined'
                                    defaultValue={unit.abbreviation}
                                />
                            </ModalBody>

                            <ModalFooter>
                                <Button color='danger' variant='light' onPress={onClose}>Cancelar</Button>
                                <Button
                                    type='submit'
                                    color='primary'
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                >
                                    Actualizar
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
