"use client"
import { authLogin, useSessionStore } from '@/modules/auth';
import { Button, Input } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner';

export const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const { setSession } = useSessionStore();
    const pathname = usePathname();

    useEffect(() => {
        setIsLoading(false)
    }, [pathname]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const { authEmail, authPassword } = e.target as HTMLFormElement;

        console.log(authEmail.value, authPassword.value)

        if (authEmail.value.trim() === '' || authPassword.value.trim() === '') {
            toast.warning("Ocurrió un error", {
                description: "Todos los campos son requeridos"
            })
        }
        const formData = new FormData(e.currentTarget);

        const { error, message, response, session } = await authLogin(formData);
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
        setSession(session ? session.user : null, session ? session.token : null)
        toast.success(message);
        // setIsLoading(false)
        router.push('/admin/home/all');

    }
    return (
        <form onSubmit={handleSubmit} className='login__form'>
            <Input
                type='email'
                name='authEmail'
                label="Correo Electronico"
                variant='underlined'
                autoFocus
            />

            <Input
                type='password'
                name='authPassword'
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
