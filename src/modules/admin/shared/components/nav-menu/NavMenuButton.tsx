import React from 'react'
import { useUIStore } from '../../stores/ui.store'
import { Button } from '@nextui-org/react';
import { Menu01Icon } from 'hugeicons-react';

export const NavMenuButton = () => {

    const { handleMenuOpen } = useUIStore();

    return (
        <Button
            onPress={handleMenuOpen}
            variant='light'
            isIconOnly
            radius='full'
            className='text-sm lg:hidden'
            startContent={<Menu01Icon />}
        />
    )
}
