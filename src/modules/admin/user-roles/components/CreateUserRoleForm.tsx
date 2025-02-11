"use client"
import { Button, Form, Input, Textarea } from '@heroui/react'
import React, { FormEvent, useState } from 'react'
import { createUserRole } from '@/modules/admin/user-roles';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const CreateUserRoleForm = () => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        // const dataArray: any[] = [];
        // formData.forEach((value, key) => {
        //     dataArray.push({ key, value });
        // });
        // console.log(dataArray)
        const { error, message, response } = await createUserRole(formData);

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

        router.push('/admin/useers/roles');

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
                    <div className="gap-4 grid md:grid-cols-2">
                        <Input
                            isRequired
                            name='roleName'
                            label='Nombre'
                            placeholder='Agrega un nombre'
                            variant='underlined'
                        />
                        <Textarea
                            isRequired
                            name='roleDescription'
                            className="max-w-xs"
                            label="Description"
                            labelPlacement="outside"
                            placeholder="Enter your description"
                            variant='underlined'
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
                Guardar Rol
            </Button>
        </Form>
    )
}
