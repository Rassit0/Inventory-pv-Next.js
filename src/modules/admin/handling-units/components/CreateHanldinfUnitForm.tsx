"use client"
import { Button, Form, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import { createHanldingUnit } from '@/modules/admin/handling-units'
import { toast } from 'sonner'

export const CreateHanldinfUnitForm = () => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const { error, message, response } = await createHanldingUnit(formData);

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

        router.push('/admin/handling-units');

        return;
    }

    return (
        <Form
            validationBehavior='native'
            // validationErrors={errors}
            className='bg-white px-6 pt-8 pb-12 boder border-gray-300 rounded space-y-6'
            onSubmit={handleSubmit}
        >
            <h2 className='text-2xl font-semibold'>Formulario</h2>
            <Input
                isRequired
                name='unitName'
                label='Nombre'
                placeholder='Agrega un nombre a la unidad'
                variant='underlined'
            />

            <Input
                isRequired
                name='unitAbbreviation'
                label="Abreviación"
                placeholder="Agrega una abreviación a la unidad"
                variant='underlined'
            />

            <Button
                type='submit'
                color='primary'
                className='block'
                isLoading={isLoading}
                isDisabled={isLoading}
            >
                Guardar Unidad
            </Button>
        </Form>
    )
}
