"use client"
import { Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, useDisclosure } from '@heroui/react'
import { Notification02Icon } from 'hugeicons-react'
import { useRouter } from 'next/navigation';
import React, { Fragment } from 'react'
import { INotification } from '@/modules/admin/notifications';

interface Props {
    notifications: INotification[];
}

export const ButtonNotifications = ({ notifications }: Props) => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    return (
        <Dropdown isOpen={isOpen} onOpenChange={onOpenChange}>
            <DropdownTrigger>
                <div className='flex items-center'>
                    {notifications.length > 0 ? (
                        <Badge className='mt-1 mr-1' color="danger" content={notifications.length} shape='circle'>
                            <Button variant="light" isIconOnly radius='full' startContent={
                                <Notification02Icon size={30} />
                            } color='primary'
                                onPress={() => isOpen ? onClose() : onOpen()}
                            />
                        </Badge>
                    ) : (
                        <Button variant="light" isIconOnly radius='full' startContent={
                            <Notification02Icon size={30} />
                        } color='primary'
                            onPress={() => isOpen ? onClose() : onOpen()}
                        />
                    )}
                </div>
            </DropdownTrigger>
            <DropdownMenu color='danger' aria-label="Dropdown menu with shortcut" variant="flat">
                <DropdownSection className='max-h-80 overflow-y-auto custom-scrollbar rounded-md'>
                    {notifications.map((notification, index) => (
                        <Fragment key={index}>
                            <DropdownItem key={"notification-" + index} shortcut="" onPress={() => router.replace(`/admin/products/${notification.slug}`)}>
                                <div className='max-w-60'>
                                    {notification.message}
                                </div>
                            </DropdownItem>
                        </Fragment>
                    ))}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
