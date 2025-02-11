"use client"
import React from 'react'
import { Button, Card, Chip, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import { EyeIcon } from 'hugeicons-react'
import { ISupplier } from '@/modules/admin/suppliers'

interface Props {
    supplier: ISupplier
}

export const SupplierDetailsModal = ({ supplier }: Props) => {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    return (
        <>
            <Button
                isIconOnly
                color='primary'
                variant='light'
                radius='full'
                startContent={<EyeIcon />}
                onPress={onOpen}
            />

            <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} size='xl' scrollBehavior='outside' placement='top'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Detalles del Proveedor
                            </ModalHeader>

                            <ModalBody className='w-full'>
                                {/* Contenido del modal usando Tailwind CSS */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><strong>Nombre del proveedor:</strong> {supplier.name}</div>
                                        <div><strong>Dirección:</strong> {supplier.address || <span className='text-gray-600'>N/A</span>}</div>
                                        <div><strong>Ubicación:</strong> {`${supplier.city}, ${supplier.country}`}</div>
                                        <div><strong>C. Postal:</strong> {supplier.zipCode || <span className='text-gray-600'>N/A</span>}</div>
                                        <div><strong>NIT:</strong> {supplier.taxId || <span className='text-gray-600'>N/A</span>}</div>
                                        <div><strong className='pr-2'>Sitio Web:</strong>
                                            {supplier.websiteUrl
                                                ? <Link isExternal isBlock showAnchorIcon color='success' href={supplier.websiteUrl}>Ir a Sitio</Link>
                                                : <span className='text-gray-600'>N/A</span>}</div>
                                        <div><strong>Teléfono:</strong> {supplier.contactInfo[0]?.phoneNumber || 'N/A'}</div>
                                        <div><strong>Correo:</strong> {supplier.contactInfo[0]?.email || 'N/A'}</div>
                                        <div><strong>Contacto Principal:</strong> {supplier.contactInfo[0]?.contactName || 'N/A'}</div>
                                        <div>
                                            <strong className='pr-2'>Estado:</strong>
                                            <Chip color={supplier.isActive ? 'success' : 'danger'} size='sm' variant='flat'>
                                                {supplier.isActive ? 'Activo' : 'Inactivo'}
                                            </Chip>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
