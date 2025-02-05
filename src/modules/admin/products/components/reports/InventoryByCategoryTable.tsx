"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { IHighDemand, IInventoryByCategory, IInventoryByCategoryProduct, ProductModalTable } from '@/modules/admin/products'
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png'

interface Props {
    response: IInventoryByCategory;
}

type ImageErrors = {
    [key: string]: boolean; // Claves como strings (IDs) y valores booleanos
};

type Key = string | number;

export const InventoryByCategoryTable = ({ response }: Props) => {

    const [selectedKeys, setSelectedKeys] = useState<"all" | Iterable<Key> | undefined>(new Set());

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalTitle, setModalTitle] = useState('');
    const [products, setProducts] = useState<IInventoryByCategoryProduct[]>([])
    const [imageErrors, setImageErrors] = useState<ImageErrors>({});

    useEffect(() => {
        // Asegurarse de que selectedKeys no sea undefined o vacío
        if (selectedKeys instanceof Set && selectedKeys.size > 0) {
            // Convertir el Set en un Array
            const selectedKeyArray = Array.from(selectedKeys);

            // Acceder al primer valor del Array y convertirlo a un string
            const selectedKey = selectedKeyArray[0].toString();

            // Filtrar los datos usando el selectedKey convertido a string
            const filteredData = response.inventoryByCategory.filter(
                (category) => category.id === selectedKey
            );

            setModalTitle(filteredData[0].name)
            setProducts(filteredData[0].products);
            onOpen();
        }
    }, [selectedKeys, response])

    useEffect(() => {
        setImageErrors({})
    }, [response])

    const handleImageError = (categoryId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [categoryId]: true,
        }));
    };

    const handleOpen = (title: string, items: IInventoryByCategoryProduct[]) => {
        setModalTitle(title);
        setProducts(items);
        onOpen();
    }
    return (
        <section className='container'>
            <Modal isOpen={isOpen} onClose={onClose} placement='top' scrollBehavior='outside'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className='flex flex-col gap-1'>{modalTitle}</ModalHeader>
                            <ModalBody>
                                <ProductModalTable products={products} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color='primary' onPress={onClose}>Aceptar</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <span className='text-default-400 text-small'>Haga click en una categoría!</span>
            <Table
                aria-label="High Demand Table"
                selectedKeys={selectedKeys}
                selectionMode='single'
                onSelectionChange={(keys) => setSelectedKeys(keys)}
            >
                <TableHeader>
                    <TableColumn>IMAGEN</TableColumn>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>DESCRIPCION</TableColumn>
                    <TableColumn>SLUG</TableColumn>
                    <TableColumn>CREADO</TableColumn>
                    <TableColumn>ACTUALIZADO</TableColumn>
                </TableHeader>
                <TableBody>
                    {
                        response.inventoryByCategory.map(category => (
                            // <TableRow key={category.id} onClick={() => handleOpen(`Productos de ${category.name}`, category.products)}>
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
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                                <TableCell>{category.createdAt.toLocaleString()}</TableCell>
                                <TableCell>{category.updatedAt.toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </section>
    )
}
