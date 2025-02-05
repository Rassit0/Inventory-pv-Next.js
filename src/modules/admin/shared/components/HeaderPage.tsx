import Link from 'next/link'
import React, { ReactNode } from 'react'

interface ILink {
    linkText: string;
    url: string;
}

interface Props {
    title: string,
    description?: string,

    linkProps?: ILink | ReactNode
}

export const HeaderPage = ({ title, description, linkProps }: Props) => {
    // Comprobación para verificar si linkProps es un objeto con las propiedades 'linkText' y 'url'
    const isLink = (props: any): props is ILink => {
        return props && typeof props === 'object' && 'linkText' in props && 'url' in props;
    };
    return (
        <section className='header'>
            <div>
                <h1 className='text-3xl font-semibold mb-2'>{title}</h1>
                {description && (
                    <p className='text-gray-500'>{description}</p>
                )}
            </div>

            {/* Si linkProps es del tipo ILink, se renderiza un enlace */}
            {linkProps && isLink(linkProps) ? (
                <Link href={linkProps.url} className='block text-primary'>
                    {linkProps.linkText}
                </Link>
            ) : (
                // Si linkProps es un ReactNode, simplemente se renderiza
                linkProps
            )}
        </section>
    )
}
