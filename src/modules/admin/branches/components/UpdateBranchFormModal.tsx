"use client"
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { IBranch } from '../interfaces/branch-response'
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@heroui/react';
import { LatitudeIcon, LongitudeIcon, PencilEdit01Icon } from 'hugeicons-react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { IUser } from '@/modules/admin/users';
import { updateBranch } from '@/modules/admin/branches';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
    branch: IBranch;
    users: IUser[];
}

export const UpdateBranchFormModal = ({ branch, users }: Props) => {
    const router = useRouter();

    const [imageError, setImageError] = useState(false);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(branch.imageUrl || null);
    // FORM
    const [branchName, setBranchName] = useState(branch.name);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageError(false);
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setPreviewImage(fileURL);
        } else {
            setPreviewImage(null);
        }
    }

    // para resetear la previsualización al cerrar el modal
    useEffect(() => {
        if (!isOpen) {
            setPreviewImage(branch.imageUrl || null);
        }
    }, [isOpen, branch.imageUrl]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const { error, message, response } = await updateBranch(formData, branch.id);

        if (error) {
            if (response && Array.isArray(response.message)) {
                response.message.forEach((msg: string) => {
                    toast.warning("Ocurrió un error", {
                        description: msg,
                    });
                });
            } else {
                toast.warning("Ocurrió un error", {
                    description: response ? response.message : message,
                });
            }

            setIsLoading(false);
            return;
        }

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

            <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} size='2xl' scrollBehavior='outside' placement='top'>
                <Form
                    validationBehavior='native'
                    // className='bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded space-y-6'
                    onSubmit={handleSubmit}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>Editar Sucursal</ModalHeader>

                                <ModalBody className="w-full">
                                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                                        <Input
                                            isRequired
                                            name='branchName'
                                            label='Nombre'
                                            placeholder='Agrega un nombre a la sucursal'
                                            variant='underlined'
                                            value={branchName}
                                            onChange={(e) => setBranchName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === ' ' || e.key === 'Enter') setBranchName(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                                            }}
                                            onBlur={() => {
                                                setBranchName(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                                            }}
                                        />

                                        <Input
                                            isRequired
                                            name='branchLocation'
                                            label='Ubicación'
                                            placeholder='Ingrese la ubicación de la Sucursal'
                                            variant='underlined'
                                            defaultValue={branch.location}
                                        />

                                        <Input
                                            type='number'
                                            name='branchPhone'
                                            label='Teléfono'
                                            placeholder='Agregue un número de telefono'
                                            variant='underlined'
                                            startContent={<span className='text-sm text-gray-500'>+591 </span>}
                                            defaultValue={branch.phone ?? ''}
                                        />

                                        <Input
                                            type='email'
                                            name='branchEmail'
                                            label='Correo de la sucursal'
                                            placeholder='ingrese@correo.com'
                                            variant='underlined'
                                            defaultValue={branch.email ?? ''}
                                        />

                                        {/* <Input
                                            type='number'
                                            name='branchLatitude'
                                            label='Latitud'
                                            placeholder='Agregue latitud'
                                            variant='underlined'
                                            endContent={<div className='text-gray-500 mb-[4px]'><LatitudeIcon size={15} /></div>}
                                            defaultValue={branch.latitude?.toString()}
                                        />

                                        <Input
                                            type='number'
                                            name='branchLongitude'
                                            label='Longitud'
                                            placeholder='Agregue longitud'
                                            variant='underlined'
                                            endContent={<div className='text-gray-500 mb-[4px]'><LongitudeIcon size={15} /></div>}
                                            defaultValue={branch.longitude?.toString()}
                                        /> */}

                                        <Select
                                            isRequired
                                            name='branchManagerId'
                                            aria-label='List users'
                                            label="Encargado"
                                            placeholder='Selecciona el encargado'
                                            variant='underlined'
                                            defaultSelectedKeys={[branch.managerId ?? '']}
                                        >
                                            {
                                                users.map(user => (
                                                    <SelectItem key={user.id}>{user.email}</SelectItem>
                                                ))
                                            }
                                        </Select>
                                    </div>

                                    <div className="w-full">
                                        <h2 className="font-semibold">Selecciona imagen</h2>
                                        <div className="gap-4 p-2">
                                            <Input
                                                name="branchImage"
                                                label="Imagen"
                                                placeholder="Selecciona una imagen de la Sucursal"
                                                type="file"
                                                variant="underlined"
                                                accept='image/*'
                                                onChange={handleImageChange}
                                            />

                                            {/* Previsualización de la imagen */}
                                            <div className='relative mt-4 w-full h-[200px] flex items-center justify-center'>
                                                <Image
                                                    src={imageError ? warning_error_image : previewImage || no_image}
                                                    alt='Vista previa'
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className='rounded-lg object-contain'
                                                    onError={() => setImageError(true)}
                                                />
                                            </div>
                                        </div>
                                    </div>
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
                            </>
                        )}
                    </ModalContent>
                </Form>
            </Modal>
        </>
    )
}
