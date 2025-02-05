"use client"
import { Button, Form, Input, Select, SelectItem } from '@heroui/react'
import React, { FormEvent, useState } from 'react'
import { IUser } from '@/modules/admin/users'
import Image from 'next/image'
import no_image from '@/assets/no_image.png'
import { LatitudeIcon, LongitudeIcon } from 'hugeicons-react'
import { createBranch } from '@/modules/admin/branches'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


interface Props {
  users: IUser[]
}

export const CreateBranchForm = ({ users }: Props) => {

  const router = useRouter();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const dataArray: any[] = [];
    formData.forEach((value, key) => {
      dataArray.push({ key, value });
    });
    console.log(dataArray)
    const { error, message, response } = await createBranch(formData);

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

    router.push('/admin/branches');

    return;
  }

  return (
    <Form
      validationBehavior='native'
      className='bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded space-y-6'
      onSubmit={handleSubmit}
    >
      <h2 className='text-2xl font-semibold'>Formulario</h2>
      <div className="w-full">
        <h2 className='font-semibold'>Datos de la Sucursal</h2>
        <div className='p-2 rounded-lg'>
          <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
          <Input
            isRequired
            name='branchName'
            label='Nombre'
            placeholder='Agrega un nombre a la sucursal'
            variant='underlined'
          />

          <Input
            isRequired
            name='branchLocation'
            label='Ubicación'
            placeholder='Ingrese la ubicación de la Sucursal'
            variant='underlined'
          />

          <Input
            type='number'
            name='branchPhone'
            label='Teléfono'
            placeholder='Agregue un número de telefono'
            variant='underlined'
            startContent={<span className='text-sm text-gray-500'>+591 </span>}
          />

          <Input
            type='email'
            name='branchEmail'
            label='Correo de la sucursal'
            placeholder='ingrese@correo.com'
            variant='underlined'
          />

          <Input
            name='branchLatitude'
            label='Latitud'
            placeholder='Agregue latitud'
            variant='underlined'
            endContent={<div className='text-gray-500 mb-[4px]'><LatitudeIcon size={15} /></div>}
          />

          <Input
            name='branchLongitude'
            label='Longitud'
            placeholder='Agregue longitud'
            variant='underlined'
            endContent={<div className='text-gray-500 mb-[4px]'><LongitudeIcon size={15} /></div>}
          />

          <Select
            isRequired
            name='branchManagerId'
            aria-label='List users'
            label="Encargado"
            placeholder='Selecciona el encargado'
            variant='underlined'
          >
            {
              users.map(user => (
                <SelectItem key={user.id}>{user.email}</SelectItem>
              ))
            }
          </Select>
          </div>
        </div>
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
        className='block'
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        Guardar Sucursal
      </Button>
    </Form>
  )
}
