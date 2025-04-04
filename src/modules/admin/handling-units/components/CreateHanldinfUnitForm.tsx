"use client"
import { Button, Form, Input } from '@heroui/react'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import { createHanldingUnit } from '@/modules/admin/handling-units'
import { toast } from 'sonner'

interface Props {
    token: string;
}
export const CreateHanldinfUnitForm = ({ token }: Props) => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [unitName, setUnitName] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const { error, message, response } = await createHanldingUnit({ token, formData });

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

        router.push('/admin/products/handling-units');

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
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') setUnitName(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                }}
                onBlur={() => {
                    setUnitName(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                }}
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
