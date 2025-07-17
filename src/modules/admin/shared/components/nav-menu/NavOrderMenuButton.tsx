"use client"
import { SideOrderCart, useOrderCartStore } from '@/modules/admin/side-orders'
import { IParallelGroup } from '@/modules/admin/production'
import { Badge, Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from '@heroui/react'
import { ChefHatIcon } from 'hugeicons-react'
import React from 'react'

interface Props {
    token: string;
    parallelGroups: IParallelGroup[];
}

export const NavOrderMenuButton = ({ parallelGroups, token }: Props) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { orderCart, parallelGroups: groups } = useOrderCartStore();

    return (
        <>
            <div className='flex items-center'>
                {(orderCart.length > 0 || Object.keys(groups).length > 0) ? (
                    <Badge
                        className='mt-1 mr-1'
                        color="danger"
                        content={orderCart.length + Object.keys(groups).length}
                        shape='circle'
                    >
                        <Button
                            onPress={onOpen}
                            isIconOnly
                            variant='light'
                            startContent={<ChefHatIcon size={30} />}
                            radius='full'
                            color='primary'
                        />
                    </Badge>
                ) : (
                    <Button
                        onPress={onOpen}
                        isIconOnly
                        variant='light'
                        startContent={<ChefHatIcon size={30} />}
                        radius='full'
                        color='primary'
                    />
                )}

            </div>
            <SideOrderCart token={token} parallelGroups={parallelGroups} isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    )
}
