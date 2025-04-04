"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { createUser, } from '@/modules/admin/users'
import { BranchesAccessUserSelect, IBranchesResponse } from '@/modules/admin/branches'
import { useRouter } from 'next/navigation'
import { Button, Checkbox, Form, Input, Select, SelectItem } from '@heroui/react'
import { toast } from 'sonner'
import { IRole } from '@/modules/admin/user-roles'
import { ImageUploaderInput } from '@/modules/admin/shared'
import { RoleModule } from '../interfaces/users-response';

interface Props {
  token: string
  branchesResponse: IBranchesResponse
  roles: IRole[]
}

export const CreateUserForm = ({ token, branchesResponse, roles }: Props) => {

  const router = useRouter();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState<string | undefined>('')

  // Form
  const [userName, setUserName] = useState('');
  const [hasGlobalBranchesAccess, setHasGlobalBranchesAccess] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL);
    } else {
      setPreviewImage(null);
    }
  }

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
    const { error, message, response } = await createUser({ token, formData });

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

    // Si se guarda con exito
    toast.success(message);
    setIsLoading(false)

    router.push('/admin/users');

    return;
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
    <Form
      validationBehavior='native'
      className='bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded space-y-6'
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold">Formulario</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 w-full'>
        {/* imagen */}
        <div className="w-full gap-4 p-2 md:col-span-1">
          <h2 className="font-semibold">Imagen de perfil</h2>
          <div className='flex flex-col justify-between h-full pb-4'>
            <ImageUploaderInput name='userImage' />
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
              />

              <Input
                isRequired
                name='userPassword'
                type='password'
                label='Contraseña'
                placeholder='Ingrese contraseña'
                variant='underlined'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input
                isRequired
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
              >
                {
                  roles.map(role => (
                    // <SelectItem key={role.id} textValue={role.name}>
                    //   <div className="p-2 rounded-lg">
                    //     {/* Nombre del Rol */}
                    //     <div className="text-base font-semibold text-primary">{role.name}</div>

                    //     {/* Módulos asignados con permisos */}
                    //     <div className="mt-1 text-xs text-gray-500">
                    //       <span className="font-medium text-gray-700">Módulos y Permisos:</span>
                    //       {role.roleModule.length > 0 ? (
                    //         <div className="mt-1 flex flex-col gap-1">
                    //           {role.roleModule.map((mod, index) => (
                    //             <div key={`index-${mod.module.name}`} className="bg-gray-100 p-2 rounded-md">
                    //               {/* Nombre del módulo */}
                    //               <div className="text-sm font-medium text-blue-700">
                    //                 {moduleMap[mod.module.name as keyof typeof moduleMap] || mod.module.name}
                    //               </div>
                    //               {/* Lista de permisos */}
                    //               {mod.roleModulePermission.length > 0 ? (
                    //                 <div className="mt-1 flex flex-wrap gap-1">
                    //                   {mod.roleModulePermission.map((perm) => (
                    //                     <span
                    //                       key={perm.permission.name}
                    //                       className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs"
                    //                     >
                    //                       {permissionMap[perm.permission.name as keyof typeof permissionMap] || perm.permission.name}
                    //                     </span>
                    //                   ))}
                    //                 </div>
                    //               ) : (
                    //                 <span className="text-gray-400 text-xs">[sin permisos]</span>
                    //               )}
                    //             </div>
                    //           ))}
                    //         </div>
                    //       ) : (
                    //         <span className="text-gray-400">[sin módulos]</span>
                    //       )}
                    //     </div>
                    //   </div>
                    // </SelectItem>
                    <SelectItem key={role.id} textValue={role.name}>
                      <div className="p-2 rounded-lg">
                        {/* Nombre del Rol */}
                        <div className="text-base font-semibold text-primary">{role.name}</div>
                      </div>
                    </SelectItem>
                  ))
                }
              </Select>
            </div>
          </div>

          {/* Formulario de user access */}
          <div className='w-full 2xl:col-span-2 space-y-1'>
            <h2 className='font-semibold'>Acceso de sucursales</h2>
            <Checkbox name='hasGlobalBranchesAccess' value={hasGlobalBranchesAccess ? 'on' : 'off'} defaultSelected={hasGlobalBranchesAccess} onValueChange={setHasGlobalBranchesAccess}>Acceso global</Checkbox>
            {!hasGlobalBranchesAccess && (
              <div className='p-2'>
                {/* <SelectUserAccessWarehouse usersResponse={usersResponse} /> */}
                <BranchesAccessUserSelect branchesResponse={branchesResponse} isRequired />
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        type='submit'
        color='primary'
        isLoading={isLoading}
        isDisabled={isLoading}
      >Guardar</Button>
    </Form>
  )
}
