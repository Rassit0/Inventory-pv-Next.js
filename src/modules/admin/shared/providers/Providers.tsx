"use client"
import { NextUIProvider } from '@nextui-org/react'
import React from 'react'
import { Toaster } from 'sonner'

interface Props {
    children: React.ReactNode
}
export const Providers = ({ children }: Props) => {
    return (
        <NextUIProvider>
            <Toaster
                position='top-center'
                closeButton
                richColors //Hace que los estados de error y éxito sean más coloridos.
                style={
                    { position: 'absolute' }
                }
            />
            {children}
        </NextUIProvider>
    )
}
