"use client"
import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@heroui/react'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';
import { updateDetailsAndStatusMovement } from '../../../actions/update-details-status-movement';
import { ConfirmQuantitiesFormTable, EMovementStatus, EMovementType, IMovement } from '@/modules/admin/inventory';
import { PencilEdit01Icon } from 'hugeicons-react';
import { IPersonsResponse } from '@/modules/admin/persons';
import { ISuppliersResponse } from '@/modules/admin/suppliers';

interface Props {
    colorButton: "warning" | "success" | "danger" | "primary" | "default" | "secondary" | undefined
    title: string;
    movement: IMovement;
    token: string;
    supplierProps: {
        create?: {
            createSupplier: boolean;
            createContact: boolean;
            personsResponse: IPersonsResponse;
        };
        suppliersResponse: ISuppliersResponse;
    }
}

export const ChangeStatusModal = ({ colorButton, title, movement, token, supplierProps }: Props) => {

    const movementStatusColorMap: Record<EMovementStatus, "primary" | "success" | "warning" | "danger" | "default"> = {
        [EMovementStatus.Pending]: "warning",
        [EMovementStatus.Canceled]: "danger",
        [EMovementStatus.Completed]: "success",
        [EMovementStatus.Accepted]: "primary", // Puedes ajustar el color según tu preferencia
    };

    const formRef = useRef<HTMLFormElement>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<EMovementStatus>(movement.status);

    useEffect(() => {
        setSelectedStatus(movement.status);
    }, [isOpen, movement])


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        setIsLoading(true);
        const formData = new FormData(formRef.current);
        const dataArray: any[] = [];
        formData.forEach((value, key) => {
            dataArray.push({ key, value });
        });

        // Convertir el array a JSON y mostrarlo
        console.log(JSON.stringify(dataArray, null, 2));
        // return;
        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message } = await updateDetailsAndStatusMovement({ formData, transactionId: movement.id, token });
        if (error) {
            if (Array.isArray(message)) {
                // Itera sobre cada mensaje en response.message y muestra un toast para cada uno
                message.forEach((msg: string) => {  // Aquí se define el tipo de 'msg'
                    toast.warning("Ocurrió un error", {
                        description: msg
                    });
                });
            } else {
                // Si no es un arreglo, muestra un solo toast con el mensaje
                toast.warning("Ocurrió un error", {
                    description: message
                });
            }

            setIsLoading(false);
            return;
        }

        // Se se guarda con éxito
        onClose();
        toast.success(message);
        setIsLoading(false);

        onClose();
    }
    return (
        <>
            <Button color={colorButton}
                onPress={onOpen}
                isDisabled={movement.status === 'COMPLETED' || movement.status === 'CANCELED'}
                size='sm' variant='ghost'
                endContent={movement.status === 'PENDING' ? <PencilEdit01Icon size={15} /> : undefined}
            >
                {title}
            </Button>

            <Modal isOpen={isOpen} size='5xl' onClose={onClose}>
                <Form
                    ref={formRef}
                    validationBehavior='native'
                    onSubmit={handleSubmit}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Estado de los detalles</ModalHeader>
                                <ModalBody>
                                    <p>¿Está seguro de cambiar el estado del movimiento?</p>
                                    <Select
                                        isRequired
                                        name='statusTransaction'
                                        color={movementStatusColorMap[selectedStatus as EMovementStatus] || "default"}
                                        variant='flat'
                                        selectedKeys={[selectedStatus]}
                                        onSelectionChange={(key) => setSelectedStatus(key.currentKey as EMovementStatus || '')}
                                        placeholder='Seleccione el estado'
                                        label='Estado'
                                    >
                                        <SelectItem key={'PENDING'}>Pendiente</SelectItem>
                                        <SelectItem key={'CANCELED'}>Cancelado</SelectItem>
                                        <SelectItem key={'COMPLETED'}>Completado</SelectItem>
                                    </Select>

                                    <ConfirmQuantitiesFormTable
                                        token={token}
                                        deliveredQuantityMode={movement.movementType === EMovementType.Adjustment ? "both" : movement.movementType === EMovementType.Income ? "suppliers" : "total"}
                                        details={movement.inventoryMovementDetails}
                                        supplierProps={supplierProps}
                                        defaultMovementStatus={movement.status}
                                        isRequiredSelectSupplier={selectedStatus === EMovementStatus.Completed}
                                        isRequiredQuantitySupplier={selectedStatus === EMovementStatus.Completed}
                                        isRequiredDeliveredQuantity={selectedStatus === EMovementStatus.Completed}
                                    />

                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cancelar
                                    </Button>
                                    <Button type='submit' color="primary">
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
