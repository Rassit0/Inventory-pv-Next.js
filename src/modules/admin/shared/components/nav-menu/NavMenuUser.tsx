import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from '@heroui/react'
import Image from 'next/image'
import React, { useState } from 'react'
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';

export const NavMenuUser = () => {
    const [imageError, setImageError] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    return (
        <div>
            <Dropdown placement="bottom-start">
                <DropdownTrigger>
                    <div className="flex gap-2 items-center cursor-pointer">
                        <div className='min-w-10'>
                            <Image
                                src={imageError ? warning_error_image : previewImage || no_image}
                                alt='Vista previa'
                                sizes="35px"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                }}
                                className='rounded-lg object-contain'
                                onError={() => setImageError(true)}
                            />
                        </div>
                        <div className="flex-col min-w-0 hidden sm:flex">
                            <span className="text-small">{'admin'}</span>
                            <span className="text-tiny text-default-400 truncate">{'admin@correo.com'}</span>
                        </div>
                    </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-bold">Inició sesión como</p>
                        <p className="font-bold">admin</p>
                    </DropdownItem>
                    <DropdownItem key="settings">Perfil</DropdownItem>
                    {/* <DropdownItem key="team_settings">Team Settings</DropdownItem>
                    <DropdownItem key="analytics">Analytics</DropdownItem>
                    <DropdownItem key="system">System</DropdownItem>
                    <DropdownItem key="configurations">Configurations</DropdownItem>
                    <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
                    <DropdownItem key="logout" color="danger">
                        Cerrar Sesión
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}
