//snnipet rafc
"use client"
import React, { useEffect } from 'react'
import { useUIStore } from '../../stores/ui.store'
import { SideMenuItems } from './SideMenuList';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from '@heroui/react';
import { Cancel01Icon } from 'hugeicons-react';
import Image from 'next/image';
import LogoValeryLetras from '@/assets/logo_valery_letras.png'
import { useRouter } from 'next/navigation';

export const SideMenu = () => {

    const { isOpenMenu, handleMenuOpen } = useUIStore();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const router = useRouter();
    useEffect(() => {
        if (isOpenMenu) onOpen();
        else onClose();
    }, [isOpenMenu])

    return (
        // <Drawer className='max-w-[340px]' radius='none' isOpen={isOpen} placement='left' onOpenChange={() => { onOpenChange(); handleMenuOpen() }} hideCloseButton>
        //     <DrawerContent>
        //         {(onClose) => (
        //             <>
        //                 <DrawerHeader className="flex flex-col gap-1">
        //                     <div className='flex justify-left'>
        //                         <Image
        //                             src={LogoValeryLetras}
        //                             alt='Auth Logo Valery'
        //                             width={150} // Ajusta el tamaño según sea necesario
        //                             // height={50} // Ajusta el tamaño según sea necesario
        //                             priority={false} // Para cargar la imagen con alta prioridad
        //                         // loading="lazy" // Carga diferida
        //                         />
        //                     </div>
        //                 </DrawerHeader>
        //                 <DrawerBody>
        //                     <div className='overflow-auto scrollbar-hide'>
        //                         {/* MENU */}
        //                         <SideMenuItems />


        //                     </div>
        //                 </DrawerBody>
        //                 <DrawerFooter className='justify-center'>
        //                     {/* CLOSE BUTTON RESPONSIVE */}
        //                     {/* <Button
        //                         className='flex lg:hidden mx-auto'
        //                         variant='light'
        //                         isIconOnly
        //                         radius='full'
        //                         startContent={<Cancel01Icon />}
        //                         onPress={handleMenuOpen}
        //                     /> */}

        //                     {/* CLOSE SESION */}
        //                     <Button
        //                         fullWidth
        //                         color='danger'
        //                         variant='light'
        //                         className='mt-auto'
        //                         onPress={() => router.push('/auth/login')}
        //                     >
        //                         Cerrar Sesión
        //                     </Button>
        //                 </DrawerFooter>
        //             </>
        //         )}
        //     </DrawerContent>
        // </Drawer>
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

            {/* <div className='pt-6 mb-6'>
                <h3 className='font-bold text-2xl flex items-end'>
                    Pollos <span className='text-primary ml-2'>
                    <Image
                    src={LogoValeryLetras}
                    alt='Auth Logo Valery'
                    width={120} // Ajusta el tamaño según sea necesario
                    height={50} // Ajusta el tamaño según sea necesario
                    priority={true} // Para cargar la imagen con alta prioridad
                />
                    </span>
                </h3>
            </div> */}

            <div className='overflow-auto scrollbar-hide'>
                {/* MENU */}
                <SideMenuItems />

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
                    onPress={() => router.push('/auth/login')}
                >
                    Cerrar Sesión
                </Button>
            </div>

        </nav>
    )
}
