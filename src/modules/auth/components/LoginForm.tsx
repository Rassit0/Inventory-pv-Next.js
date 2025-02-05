"use client"
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

export const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const {email, password} = e.target as HTMLFormElement;
        
        console.log(email.value, password.value)

        if(email.value.trim() === '' || password.value.trim() === ''){
            toast.warning("Ocurrió un error", {
                description: "Todos los campos son requeridos"
            })
        }

        // TODO: Agregar login con credenciales
        router.push('/admin/home');

        setIsLoading(false)
    }
    return (
        <form onSubmit={handleSubmit} className='login__form'>
            <Input
                type='email'
                name='email'
                label="Correo Electronico"
                variant='underlined'
            />

            <Input
                type='password'
                name='password'
                label="Contraseña"
                variant='underlined'
            />

            <Button
                type='submit'
                color='primary'
                fullWidth
                isLoading={isLoading}
                isDisabled={isLoading}
            >
                Iniciar Sesión
            </Button>
        </form>
    )
}
