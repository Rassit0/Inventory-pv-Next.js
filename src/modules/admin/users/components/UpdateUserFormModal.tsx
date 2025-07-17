"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { BranchesAccessUserSelect, IBranchesResponse } from '@/modules/admin/branches'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ImageUploaderInput } from '@/modules/admin/shared'
import { Button, Checkbox, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, useDisclosure } from '@heroui/react'
import { IUser, updateUser } from '@/modules/admin/users'
import { PencilEdit01Icon, ViewIcon, ViewOffIcon } from 'hugeicons-react'
import { IRole } from '@/modules/admin/user-roles'

interface Props {
    token: string
    branchesResponse: IBranchesResponse
    roles: IRole[];
    user: IUser
}

export const UpdateUserFormModal = ({ branchesResponse, roles, token, user }: Props) => {

    const router = useRouter();

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form
    const [userName, setUserName] = useState(user.name);
    const [userEmail, setUserEmail] = useState(user.email);
    const [selectedRole, setSelectedRole] = useState<string[] | undefined>([user.roleId])
    const [password, setPassword] = useState<string>('')
    const [viewPassword, setViewPassword] = useState(false)
    const [userIsEnable, setUserIsEnable] = useState(user.isEnable);

    const [hasGlobalBranchesAccess, setHasGlobalBranchesAccess] = useState(user.hasGlobalBranchesAccess);

    // Modal
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    // Funcion para el submit del form
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        // const dataArray: any[] = [];
        // formData.forEach((value, key) => {
        //   dataArray.push({ key, value });
        // });
        // console.log(formData.get("userBranchesIds"))
        if (!formData.get("userBranchesIds") && !hasGlobalBranchesAccess) {
            toast.error("Debe seleccionar al menos una sucursal de acceso.");
            setIsLoading(false);
            return;
        }
        const { error, message, response } = await updateUser({ token, formData, userId: user.id });

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

        // Si se guarda con éxito
        toast.success(message);
        setIsLoading(false);

        onClose();
    }

    const permissionMap = {
        'READ': 'leer',
        'WRITE': 'escribir',
        'EDIT': 'editar',
        'DELETE': 'eliminar',
        'MANAGE': 'gestionar',
    };

    const moduleMap = {
        'USERS': 'usuarios',
        'REPORTS': 'reportes',
        'INVENTORY': 'inventario',
        'PRODUCTS': 'productos',
        'SETTINGS': 'configuración',
        'BRANCHES': 'sucursales',
        'PRODUCTION': 'producción',
        'WAREHOUSES': 'almacenes',
        'SUPPLIERS': 'proveedores',
        'HOME': 'inicio',
    };

    return (
        <>
            <Button
                onPress={onOpen}
                isIconOnly
                color='warning'
                variant='light'
                radius='full'
                startContent={<PencilEdit01Icon />}
            />
            <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='outside' placement='top' size='4xl'>
                <Form
                    validationBehavior='native'
                    className='bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded space-y-6'
                    onSubmit={handleSubmit}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>Editar Usuario</ModalHeader>

                                <ModalBody className='w-full'>
                                    {/* <h2 className="text-2xl font-semibold">Formulario</h2> */}
                                    <div className='grid grid-cols-1 md:grid-cols-3 w-full'>
                                        {/* imagen */}
                                        <div className="w-full gap-4 p-2 md:col-span-1">
                                            <h2 className="font-semibold">Imagen de perfil</h2>
                                            <div className='flex flex-col justify-between h-full pb-4'>
                                                <ImageUploaderInput name='userImage' imageDefault={user.imageUrl ?? undefined} />
                                            </div>
                                        </div>
                                        <div className='w-full md:col-span-2 grid grid-cols-1 gap-4'>
                                            <div className="w-full">
                                                <h2 className='font-semibold'>Datos de usuario</h2>
                                                <div className='p-2 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                                    <Input
                                                        isRequired
                                                        name='userName'
                                                        label='Nombre de usuario'
                                                        placeholder='Agrega un nombre'
                                                        variant='underlined'
                                                        value={userName}
                                                        onChange={(e) => setUserName(e.target.value)}
                                                    // onKeyDown={(e) => {
                                                    //   if (e.key === ' ' || e.key === 'Enter') setUserName(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                                                    // }}
                                                    // onBlur={() => {
                                                    //   setUserName(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                                                    // }}
                                                    />

                                                    <Input
                                                        isRequired
                                                        name='userEmail'
                                                        type='email'
                                                        label='Email'
                                                        placeholder='Ingrese el correo'
                                                        variant='underlined'
                                                        value={userEmail}
                                                        onChange={(e) => setUserEmail(e.target.value)}
                                                    />

                                                    <Input
                                                        name='userPassword'
                                                        type={viewPassword ? 'text' : 'password'}
                                                        label='Contraseña'
                                                        placeholder='Ingrese contraseña'
                                                        variant='underlined'
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        validate={(value) => {
                                                            if (value && value.length < 8) {
                                                                return "La contraseña debe tener al menos 8 caracteres.";
                                                            }
                                                            if (value && !/[A-Z]/.test(value)) {
                                                                return "Debe contener al menos una letra mayúscula.";
                                                            }
                                                            if (value && !/[a-z]/.test(value)) {
                                                                return "Debe contener al menos una letra minúscula.";
                                                            }
                                                            if (value && !/[0-9]/.test(value)) {
                                                                return "Debe contener al menos un número.";
                                                            }
                                                            if (value && !/[^A-Za-z0-9]/.test(value)) {
                                                                return "Debe contener al menos un símbolo.";
                                                            }
                                                            return null;
                                                        }}
                                                        endContent={
                                                            <Button
                                                                isIconOnly
                                                                variant='light'
                                                                radius='full'
                                                                color='primary'
                                                                startContent={
                                                                    viewPassword ? <ViewIcon /> : <ViewOffIcon />
                                                                }
                                                                onPress={() => setViewPassword(!viewPassword)}
                                                            />
                                                        }

                                                    />

                                                    <Input
                                                        isRequired={password !== ''}
                                                        name='passwordConfirm'
                                                        type='password'
                                                        label='Confirmar contraseña'
                                                        placeholder='Repita la contraseña'
                                                        variant='underlined'
                                                        validate={(value) => {
                                                            if (value != password) {
                                                                return "La contraseña no coincide";
                                                            }

                                                            // return value === "admin" ? "Nice try!" : null;
                                                        }}
                                                    />

                                                    <Select
                                                        isRequired
                                                        className='md:col-span-2 2xl:col-span-1'
                                                        name='userRoleId'
                                                        aria-label='List branches'
                                                        label='Rol y permisos'
                                                        placeholder='Seleccione el rol '
                                                        variant='underlined'
                                                        selectionMode='single'
                                                        selectedKeys={selectedRole}
                                                        onSelectionChange={keys => setSelectedRole(keys.currentKey ? [keys.currentKey] : undefined)}
                                                    >
                                                        {
                                                            roles.map(role => (
                                                                <SelectItem key={role.id} textValue={role.name}>
                                                                    <div className="p-2 rounded-lg">
                                                                        {/* Nombre del Rol */}
                                                                        <div className="text-base font-semibold text-primary">{role.name}</div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </Select>
                                                    <input type="hidden" name="userIsEnable" value={userIsEnable ? 'true' : 'false'} />
                                                    <Switch
                                                        className='pt-4'
                                                        defaultSelected
                                                        color="success"
                                                        size="sm"
                                                        isSelected={userIsEnable}
                                                        onValueChange={(value) => setUserIsEnable(value)}
                                                    >
                                                        Activo
                                                    </Switch>
                                                </div>
                                            </div>

                                            {/* Formulario de user access */}
                                            <div className='w-full 2xl:col-span-2 space-y-1'>
                                                <h2 className='font-semibold'>Acceso de sucursales</h2>
                                                <Checkbox name='hasGlobalBranchesAccess' value={hasGlobalBranchesAccess ? 'on' : 'off'} defaultSelected={hasGlobalBranchesAccess} onValueChange={setHasGlobalBranchesAccess}>Acceso global</Checkbox>
                                                {!hasGlobalBranchesAccess && (
                                                    <div className='p-2'>
                                                        {/* <SelectUserAccessWarehouse usersResponse={usersResponse} /> */}
                                                        <BranchesAccessUserSelect
                                                            isRequired
                                                            branchesResponse={branchesResponse}
                                                            defaultBranches={user.userBranches}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>

                                <ModalFooter>
                                    <Button color='danger' variant='light' onPress={onClose}>Cancelar</Button>
                                    <Button
                                        type='submit'
                                        color='primary'
                                        className='block'
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
