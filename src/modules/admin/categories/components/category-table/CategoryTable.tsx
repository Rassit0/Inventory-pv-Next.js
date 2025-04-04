"use client"
import React, { useEffect, useState } from 'react'
import { DeleteCategoryModal, ICategoriesResponse, ISimpleCategory } from '@/modules/admin/categories'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import Image from 'next/image'
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png'
import { UpdateCategoryModal } from '../UpdateCategoryModal'

interface Props {
    editCategory: boolean;
    deleteCategory: boolean;
    categories: ISimpleCategory[];
    token: string;
}

type ImageErrors = {
    [key: string]: boolean; // Claves como strings (IDs) y valores booleanos
};

export const CategoryTable = ({ editCategory, deleteCategory, categories, token }: Props) => {
    const [imageErrors, setImageErrors] = useState<ImageErrors>({});
    useEffect(() => {
        setImageErrors({})
    }, [categories])

    const handleImageError = (categoryId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [categoryId]: true,
        }));
    };
    return (
        <section className='container pt-8'>
            <Table
                aria-label='Lista de categorías'
                selectionMode="single"
            >
                <TableHeader>
                    <TableColumn>IMAGEN</TableColumn>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>DECRIPCIÓN</TableColumn>
                    <TableColumn>FECHA DE CREACIÓN</TableColumn>
                    <TableColumn hideHeader={!editCategory && !deleteCategory}>ACCIONES</TableColumn>
                </TableHeader>

                <TableBody emptyContent={"¡Ups! No encontramos nada aquí."}>
                    {
                        categories.map(category => (
                            <TableRow key={category.id}>
                                <TableCell>
                                    <div className='w-full h-16 flex items-center justify-center'>
                                        <Image
                                            alt={category.name}
                                            src={imageErrors[category.id] ? warning_error_image : category.imageUrl || no_image}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className='object-contain'
                                            priority={category.imageUrl ? false : true}
                                            onError={() => handleImageError(category.id)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <p className="text-bold text-sm capitalize">{category.name}</p>
                                        <p className="text-bold text-xs capitalize text-default-400">
                                            {category.parents.map((parent, index) => (
                                                <span key={parent.parent.id}>
                                                    {parent.parent.name}{index < category.parents.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </p>

                                    </div>
                                </TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>{category.createdAt.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex">
                                        {editCategory && (<UpdateCategoryModal category={category} categories={categories} token={token} />)}
                                        {deleteCategory && (<DeleteCategoryModal categoryId={category.id} token={token} />)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </section>
    )
}
