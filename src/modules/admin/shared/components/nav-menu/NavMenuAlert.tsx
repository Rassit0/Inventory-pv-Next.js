import { Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, useDisclosure } from '@heroui/react'
import { Notification02Icon } from 'hugeicons-react'
import React, { Fragment, useState } from 'react'

export const NavMenuAlert = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    return (
        <Dropdown isOpen={isOpen} onOpenChange={onOpenChange}>
            <DropdownTrigger>
                <div className='flex items-center'>
                    <Badge className='mt-1 mr-1' color="danger" content="5" shape='circle'>
                        <Button variant="light" isIconOnly radius='full' startContent={
                            <Notification02Icon size={30} />
                        } color='primary'
                            onPress={() => isOpen ? onClose() : onOpen()}
                        />
                    </Badge>
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dropdown menu with shortcut" variant="flat">
                <DropdownSection className='max-h-80 overflow-y-auto custom-scrollbar rounded-md'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((notification, index) => (
                        <Fragment key={index}>
                            <DropdownItem key={"new" + index} shortcut="">
                                EL producto se está quedando sin stock.
                            </DropdownItem>
                            <DropdownItem key={"copy" + index} shortcut="">
                                EL producto se está quedando sin stock.
                            </DropdownItem>
                            <DropdownItem key={"edit" + index} shortcut="">
                                EL producto se está quedando sin stock.
                            </DropdownItem>
                            <DropdownItem key={"delete" + index} className="text-danger" color="danger" shortcut="">
                                EL producto se está quedando sin stock.
                            </DropdownItem>
                        </Fragment>
                    ))}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
