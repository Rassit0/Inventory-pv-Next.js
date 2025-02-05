"use client"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { ICategoryStatisticsResponse } from '@/modules/admin/products'
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png'

interface Props {
    response: ICategoryStatisticsResponse;
}

type ImageErrors = {
    [key: string]: boolean; // Claves como strings (IDs) y valores booleanos
};

type Key = string | number;

export const CategoryStatsticsTable = ({ response }: Props) => {

    const [selectedKeys, setSelectedKeys] = useState<"all" | Iterable<Key> | undefined>(new Set());

    const [imageErrors, setImageErrors] = useState<ImageErrors>({});

    useEffect(() => {
        setImageErrors({})
    }, [response])

    const handleImageError = (categoryId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [categoryId]: true,
        }));
    };

    return (
        <section className='container'>
            <Table
                aria-label="High Demand Table"
                selectedKeys={selectedKeys}
                selectionMode='single'
                onSelectionChange={(keys) => setSelectedKeys(keys)}
            >
                <TableHeader>
                    <TableColumn>IMAGEN</TableColumn>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>TOTAL PRODUCTOS</TableColumn>
                    <TableColumn>TOTAL STOCK</TableColumn>
                </TableHeader>
                <TableBody>
                    {
                        response.statistics.map(category => (
                            // <TableRow key={category.id} onClick={() => handleOpen(`Productos de ${category.name}`, category.products)}>
                            <TableRow key={category.categoryName}>
                                <TableCell>
                                    <div className='w-full h-16 flex items-center justify-center'>
                                        <Image
                                            alt={category.categoryName}
                                            src={imageErrors[category.categoryName] ? warning_error_image : category.imageUrl || no_image}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className='object-contain'
                                            priority={category.imageUrl ? false : true}
                                            onError={() => handleImageError(category.categoryName)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>{category.categoryName}</TableCell>
                                <TableCell>{category.totalProducts}</TableCell>
                                <TableCell>{category.totalStock}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </section>
    )
}
