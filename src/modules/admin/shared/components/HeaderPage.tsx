"use client"
import { Button, Tooltip } from '@heroui/react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { ReactNode } from 'react'

interface ILink {
    linkText: string | ReactNode;
    url: string;
}

interface Props {
    title: string,
    description?: string,
    button?: {
        popoverText?: string;
        delayPopover?: number;
        colorButton?: "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined;
        variantButton?: "shadow" | "light" | "solid" | "bordered" | "flat" | "faded" | "ghost" | undefined;
    };
    linkProps?: ILink
}

export const HeaderPage = ({ title, description, linkProps, button = { colorButton: 'primary', variantButton: 'light' } }: Props) => {
    const router = useRouter()
    return (
        <section className='header'>
            <div>
                <h1 className='text-3xl font-semibold mb-2'>{title}</h1>
                {description && (
                    <p className='text-gray-500'>{description}</p>
                )}
            </div>

            {/* Si linkProps es del tipo ILink, se renderiza un enlace */}
            {linkProps ? (
                !button ?
                    (<Link href={linkProps.url} className='block text-primary'>
                        {linkProps.linkText}
                    </Link>)
                    :
                    (<Tooltip hidden={button.popoverText ? false : true} content={button.popoverText} color='primary' delay={button.delayPopover}>
                        <Button
                            isIconOnly={typeof linkProps.linkText !== 'string'}
                            startContent={linkProps.linkText}
                            radius='full'
                            color={button.colorButton}
                            variant={button.variantButton}
                            onPress={() => router.push(linkProps.url)}
                        >{typeof linkProps.linkText !== 'string' ? undefined : linkProps.linkText}</Button>
                    </Tooltip>)
            ) : (
                // Si linkProps es un ReactNode, simplemente se renderiza
                linkProps
            )}
        </section>
    )
}
