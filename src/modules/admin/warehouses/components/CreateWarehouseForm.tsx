"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { IUser, IUsersResponse, UserAccessWarehouseTable } from '@/modules/admin/users'
import { IBranch } from '@/modules/admin/branches'
import { useRouter } from 'next/navigation'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input, Select, SelectItem } from '@nextui-org/react'
import { LatitudeIcon, LongitudeIcon, PlusSignIcon } from 'hugeicons-react'

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

    return;
  }

  return (
    <Form
      validationBehavior='native'
      className='bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded space-y-6'
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold">Formulario</h2>
      <div className="w-full">
        <h2 className='font-semibold'>Datos de la Sucursal</h2>
        <div className='p-2 rounded-lg'>
          <Input
            isRequired
            name='warehouseName'
            label='Nombre'
            placeholder='Agrega un nombre a el almacén'
            variant='underlined'
          />

          <Input
            isRequired
            name='warehouseLocation'
            label='Ubicación'
            placeholder='Ingrese la ubicación de el Almacén'
            variant='underlined'
          />

          <Input
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
          />

          <Select
            isRequired
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
      <div className='w-full'>
        <h2 className='font-semibold'>Acceso de usuarios</h2>
        <div className='space-y-4 p-2'>
            <UserAccessWarehouseTable usersResponse={usersResponse}/>
        </div>
      </div>
    </Form>
  )
}
