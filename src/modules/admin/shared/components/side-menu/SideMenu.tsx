//snnipet rafc
"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useUIStore } from '../../stores/ui.store'
import { SideMenuItems } from './SideMenuList';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from '@heroui/react';
import { Cancel01Icon } from 'hugeicons-react';
import Image from 'next/image';
import LogoValeryLetras from '@/assets/logo_valery_letras.png'
import { useRouter } from 'next/navigation';
import { authLogout, IUser, useSessionStore } from '@/modules/auth';


// Hook para detectar el tamaño de la pantalla
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, [query]);

    return matches;
};

interface Props {
    user: IUser
}

export const SideMenu = ({ user }: Props) => {

    const { isOpenMenu, handleMenuOpen } = useUIStore();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { logout } = useSessionStore();
    const { handleChangeBranchId } = useUIStore();
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    useEffect(() => {
        if (isOpenMenu) onOpen();
        else onClose();
    }, [isOpenMenu])

    const isMdOrLarger = useMediaQuery("(min-width: 1024px)"); // Detecta si la pantalla es lg o mayor

    useEffect(() => {
        if (!isMdOrLarger) { // Si es menor a md, usa el estado de `isOpenMenu`
            isOpenMenu ? onOpen() : onClose();
        }
    }, [isOpenMenu, isMdOrLarger]);

    const handleLogout = () => {
        setIsLoading(true);
        router.push("/auth/login");

        setTimeout(() => {
            handleChangeBranchId(undefined);
            logout();
            setIsLoading(false);
            authLogout();
        }, 500); // Espera 500ms antes de ejecutar logout
    }

    return (
        <>
            {isMdOrLarger ? (
                <nav className={isOpenMenu ? 'sidemenu sidemenu-show' : 'sidemenu'}>
                    {/* LOGO */}
                    {/* <div className='pt-8 mb-6'>
                <h3 className='font-bold text-2xl'>
                    Pollos <span className='text-primary'>VALERY</span>
                </h3>
            </div> */}
                    <div className='pt-4 mb-5 flex justify-left'>
                        <Image
                            src={LogoValeryLetras}
                            alt='Auth Logo Valery'
                            width={150} // Ajusta el tamaño según sea necesario
                            // height={50} // Ajusta el tamaño según sea necesario
                            priority={false} // Para cargar la imagen con alta prioridad
                        // loading="lazy" // Carga diferida
                        />
                    </div>

                    <div className='overflow-auto scrollbar-hide'>
                        {/* MENU */}
                        <SideMenuItems user={user} />

                        {/* CLOSE BUTTON RESPONSIVE */}
                        <Button
                            className='flex lg:hidden mx-auto'
                            variant='light'
                            isIconOnly
                            radius='full'
                            startContent={<Cancel01Icon />}
                            onPress={handleMenuOpen}
                        />

                        {/* CLOSE SESION */}
                        <Button
                            fullWidth
                            color='danger'
                            variant='light'
                            className='mt-auto'
                            onPress={handleLogout}
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        >
                            Cerrar Sesión
                        </Button>
                    </div>

                </nav>
            ) :
                (
                    <Drawer className='max-w-[340px]' radius='none' isOpen={isOpen} placement='left' onOpenChange={() => { onOpenChange(); handleMenuOpen() }} hideCloseButton>
                        <DrawerContent>
                            {(onClose) => (
                                <>
                                    <DrawerHeader className="flex flex-col gap-1">
                                        <div className='flex justify-left'>
                                            <Image
                                                src={LogoValeryLetras}
                                                alt='Auth Logo Valery'
                                                width={150} // Ajusta el tamaño según sea necesario
                                                // height={50} // Ajusta el tamaño según sea necesario
                                                priority={false} // Para cargar la imagen con alta prioridad
                                            // loading="lazy" // Carga diferida
                                            />
                                        </div>
                                    </DrawerHeader>
                                    <DrawerBody>
                                        <div className='overflow-auto scrollbar-hide'>
                                            {/* MENU */}
                                            <SideMenuItems user={user} />


                                        </div>
                                    </DrawerBody>
                                    <DrawerFooter className='justify-center'>
                                        {/* CLOSE BUTTON RESPONSIVE */}
                                        {/* <Button
                                className='flex lg:hidden mx-auto'
                                variant='light'
                                isIconOnly
                                radius='full'
                                startContent={<Cancel01Icon />}
                                onPress={handleMenuOpen}
                            /> */}

                                        {/* CLOSE SESION */}
                                        <Button
                                            fullWidth
                                            color='danger'
                                            variant='light'
                                            className='mt-auto'
                                            onPress={handleLogout}
                                            isLoading={isLoading}
                                            isDisabled={isLoading}
                                        >
                                            Cerrar Sesión
                                        </Button>
                                    </DrawerFooter>
                                </>
                            )}
                        </DrawerContent>
                    </Drawer>
                )
            }
        </ >
    )
}
