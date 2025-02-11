"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { IUser, IUsersResponse } from '@/modules/admin/users'
import { IBranch } from '@/modules/admin/branches'
import { useRouter } from 'next/navigation'
import { Button, Form, Input, Select, SelectItem } from '@heroui/react'
import { LatitudeIcon, LongitudeIcon } from 'hugeicons-react'
import { UserAccessWarehouseSelect } from '../../users/components/UserAccessWarehouseSelect';
import Image from 'next/image'
import no_image from '@/assets/no_image.png'
import { toast } from 'sonner'
import { createWarehouse } from '@/modules/admin/warehouses'

interface Props {
  usersResponse: IUsersResponse,
  branches: IBranch[]
}

export const CreateWarehouseForm = ({ branches, usersResponse }: Props) => {

  const router = useRouter();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    // console.log(dataArray)
    const { error, message, response } = await createWarehouse(formData);

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

    router.push('/admin/warehouses');

    return;
  }

  return (
    <Form
      validationBehavior='native'
      className='bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded space-y-6'
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold">Formulario</h2>
      <div className='w-full grid grid-cols-1 2xl:grid-cols-3 gap-4'>
        <div className="w-full">
          <h2 className='font-semibold'>Datos del Almacén</h2>
          <div className='p-2 rounded-lg grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-1 gap-4'>
            <Input
              isRequired
              name='warehouseName'
              label='Nombre'
              placeholder='Agrega un nombre'
              variant='underlined'
            />

            <Input
              isRequired
              name='warehouseLocation'
              label='Ubicación'
              placeholder='Ingrese la ubicación'
              variant='underlined'
            />

            {/* <Input
            name='warehouseLatitude'
            label='Latitud'
            placeholder='Ingresar latitud'
            variant='underlined'
            endContent={<div className='text-green-500 mb-[4px]'><LatitudeIcon size={15} /></div>}
          />

          <Input
            name='warehouseLongitude'
            label='Longitud'
            placeholder='Ingresar longitud'
            variant='underlined'
            endContent={<div className='text-gray-500 mb-[4px]'><LongitudeIcon size={15} /></div>}
          /> */}

            <Select
              isRequired
              className='md:col-span-2 2xl:col-span-1'
              name='warehouseBranchIds'
              aria-label='List branches'
              label='Sucursal'
              placeholder='Seleccione la(s) sucursal'
              variant='underlined'
              selectionMode='multiple'
            >
              {
                branches.map(branch => (
                  <SelectItem key={branch.id}>{branch.name}</SelectItem>
                ))
              }
            </Select>
          </div>
        </div>

        {/* Formulario de user access */}
        <div className='w-full 2xl:col-span-2'>
          <h2 className='font-semibold'>Acceso de usuarios</h2>
          <div className='p-2'>
            {/* <SelectUserAccessWarehouse usersResponse={usersResponse} /> */}
            <UserAccessWarehouseSelect usersResponse={usersResponse} isRequired />
          </div>
        </div>
      </div>

      {/* imagen */}
      <div className="w-full">
        <h2 className="font-semibold">Selecciona imagen</h2>
        <div className="gap-4 p-2">
          <Input
            name="warehouseImage"
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
              src={previewImage || no_image}
              alt='Vista previa'
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className='rounded-lg object-contain'
            />
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
