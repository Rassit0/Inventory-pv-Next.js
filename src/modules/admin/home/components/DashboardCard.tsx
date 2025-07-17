"use client"
import { Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Image, Link } from '@heroui/react'
import { ArrowRight01Icon } from 'hugeicons-react';
import React from 'react'

interface SummaryCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    description?: string;
    linkUrl?: string;
    linkText?: string;
    isLoading?: boolean;
}

export const DashboardCard = ({
    title,
    value,
    icon,
    description,
    linkUrl,
    linkText = 'Ver detalle',
    isLoading = false
}: SummaryCardProps) => {
    return (
        <Card className="w-full" shadow='sm'>
            <CardHeader className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            </CardHeader>
            <Divider />
            <CardBody>
                {isLoading ?
                    (
                        <CircularProgress size='lg' aria-label="Cargando..." />
                    )
                    :
                    (
                        <>
                            <div className="text-3xl font-bold text-gray-900">{value}</div>
                            {description && (
                                <p className="text-sm text-gray-500 mt-1">{description}</p>
                            )}
                        </>
                    )
                }
            </CardBody>
            {linkUrl && (
                <>
                    <Divider />
                    <CardFooter>
                        <Link href={linkUrl} className="flex items-center text-sm text-primary hover:underline">
                            {linkText}
                            <ArrowRight01Icon className="ml-1 h-4 w-4" />
                        </Link>
                    </CardFooter>
                </>
            )}
        </Card>
    )
}
