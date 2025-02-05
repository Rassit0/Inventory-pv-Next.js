"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { IProduct, updateProduct } from '@/modules/admin/products';
import { ISimpleCategory } from '@/modules/admin/categories';
import { ISimpleHandlingUnit } from '@/modules/admin/handling-units';
import { toast } from 'sonner';
import { Button, DatePicker, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@heroui/react';
import { PencilEdit01Icon } from 'hugeicons-react';
import { parseDate } from '@internationalized/date';
import Image, { StaticImageData } from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';

interface Props {
    product: IProduct,
    products: IProduct[],
    categories: ISimpleCategory[],
    handlingUnits: ISimpleHandlingUnit[]
}

interface SelectedProduct {
    id: string;
    quantity: number;
}
export const UpdateProductFormModal = ({ product, products, categories, handlingUnits }: Props) => {
    const [imageError, setImageError] = useState(false);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(product.imageUrl || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageError(false);
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setPreviewImage(fileURL);
        } else {
            setPreviewImage(null);
        }
    }

    // Cargar los insumos iniciales cuando el modal se abre
    useEffect(() => {
        if (product?.composedByProducts) {
            // Mapear las composiciones de producto para obtener los insumos con su cantidad
            const initialSelectedProducts = product.composedByProducts.map(composition => ({
                id: composition.componentProduct.id,
                quantity: Number(composition.quantity) || 1 // Convertir a número y asegurarse de un valor por defecto
            }));
            setSelectedProducts(initialSelectedProducts);
        }
    }, [isOpen, product]); // Este useEffect se dispara cuando el producto cambia


    const handleSelectionChange = (selected: Set<string>) => {
        const selectedIds = Array.from(selected); // Convierte a un arreglo de IDs
        const updatedProducts = selectedIds.map((id) => {
            const existingProduct = selectedProducts.find((p) => p.id === id);
            return existingProduct || { id, quantity: 1 }; // Si no existe, inicializa con cantidad 1
        });
        setSelectedProducts(updatedProducts);
    };

    const handleQuantityChange = (id: string, quantity: string) => {
        // Usamos setSelectedProducts para actualizar el estado de los productos seleccionados.
        setSelectedProducts((prev) =>
            // 'prev' es el estado anterior (el listado de productos), y lo estamos iterando con 'map' para actualizar solo el producto que tiene el 'id' correspondiente.
            prev.map((product) =>
                // Comprobamos si el 'id' del producto coincide con el 'id' proporcionado.
                product.id === id
                    ? {
                        // Si coincide, actualizamos ese producto.
                        ...product, // Mantenemos todas las propiedades del producto original.
                        quantity: parseFloat(quantity) || 1 // La cantidad se actualiza con el valor convertido a número. Si no es un número válido, se asigna 1.
                    }
                    : product // Si el 'id' no coincide, dejamos el producto sin cambios.
            )
        );
    };


    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await updateProduct(formData, product.id);
        if (error) {
            toast.warning("Ocurrió un error", {
                description: response ? response.message : message
            });

            setIsLoading(false);
            return;
        }

        // Si se guarda con éxito
        toast.success(message);
        setIsLoading(false);

        onClose();
    }

    // useEffect para resetear la previsualización al cerrar el modal
    useEffect(() => {
        if (!isOpen) {
            setPreviewImage(product.imageUrl || null);
        }
    }, [isOpen, product.imageUrl]);

    return (
        <>
            <Button
                onPress={onOpen}
                isIconOnly
                color='warning'
                variant='light'
                radius='full'
                startContent={<PencilEdit01Icon />}
            />
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='outside' placement='top' size='4xl'>
                <ModalContent>
                    {(onClose) => (
                        <Form
                            validationBehavior="native"
                            // className="bg-white px-6 pt-8 pb-12 boder border-gray-300 rounded space-y-6"
                            // style={{ margin: 0, padding: 0, width: '100%' }}
                            onSubmit={handleSubmit}
                        >
                            <ModalHeader>Editar Producto</ModalHeader>

                            <ModalBody className='w-full'>
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Input
                                        isRequired
                                        name="productName"
                                        label="Nombre"
                                        placeholder="Agrega un nombre a el producto"
                                        variant="underlined"
                                        defaultValue={product.name}
                                    />

                                    <Input
                                        isRequired
                                        name="productDescription"
                                        label="Descripción"
                                        placeholder="Agrega una descripción a el producto"
                                        variant="underlined"
                                        defaultValue={product.description}
                                    />

                                    <Select
                                        isRequired
                                        name="productType"
                                        label='Tipo de Producto'
                                        placeholder="Selecciona el tipo de producto"
                                        variant="underlined"
                                        defaultSelectedKeys={[product.type]}
                                    >
                                        <SelectItem key={'FinalProduct'}>Producto Final</SelectItem>
                                        <SelectItem key={'RawMaterial'}>Insumo</SelectItem>
                                    </Select>

                                    <Input
                                        isRequired
                                        name="productPrice"
                                        label='Precio'
                                        placeholder="Ingrese el precio de venta"
                                        type="number"
                                        variant="underlined"
                                        // startContent={<SaleTag02Icon size={20}/>}
                                        endContent="Bs."
                                        min={0}
                                        step="0.01"
                                        defaultValue={Number(product.price).toFixed(2)}
                                    />

                                    <Select
                                        isRequired
                                        name="productUnitId"
                                        label='Unidad de manejo'
                                        placeholder="Selecciona la unidad de manejo"
                                        variant="underlined"
                                        defaultSelectedKeys={[product.unitId]}
                                    >
                                        {
                                            handlingUnits.map(unit => (
                                                <SelectItem key={unit.id}>{unit.name}</SelectItem>
                                            ))
                                        }
                                    </Select>

                                    <DatePicker
                                        name="productLaunchDate"
                                        label="Fecha de lanzamiento"
                                        variant="underlined"
                                        // defaultValue={product.launchDate ? parseDate((new Date(product.launchDate)).toISOString().split('T')[0].replaceAll('/', '-')) : null}
                                    />

                                    <DatePicker
                                        name="productExpirationDate"
                                        label="Fecha de expiración"
                                        variant="underlined"
                                        // defaultValue={product.expirationDate ? parseDate((new Date(product.expirationDate)).toISOString().split('T')[0].replaceAll('/', '-')) : null}
                                    />

                                    <Input
                                        name="productPurchasePrice"
                                        label='Precio de compra'
                                        placeholder="Ingrese el precio de compra"
                                        type="number"
                                        variant="underlined"
                                        // startContent={<SaleTag02Icon size={20}/>}
                                        endContent="Bs."
                                        min={0}
                                        step="0.01"
                                        defaultValue={product.purchasePrice}
                                    />

                                    <Input
                                        name="productMinimunStock"
                                        label="Stock mínimo"
                                        placeholder="Ingrese el stock mínimo"
                                        type="number"
                                        variant="underlined"
                                        defaultValue={"1"}
                                    />

                                    <Input
                                        name="productReorderPoint"
                                        label="Stock mínimo para reorden"
                                        placeholder="Ingrese el stock mínimo para reordenar"
                                        type="number"
                                        variant="underlined"
                                        defaultValue={"1"}
                                    />

                                    <Select
                                        name="categoryIds"
                                        label="Categoría(s)"
                                        placeholder="Seleccione la categoría(s) del producto"
                                        variant="underlined"
                                        selectionMode="multiple"
                                        defaultSelectedKeys={product.categories.map(category => category.id)}
                                    >
                                        {
                                            categories.map(category => (
                                                <SelectItem key={category.id}>{category.name}</SelectItem>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <div className="w-full">
                                    <h2 className="font-semibold">Insumos del producto</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <Select
                                            name="componentIds"
                                            label="Insumos para preparación"
                                            placeholder="Selecciona si tiene insumos para su preparación"
                                            variant="underlined"
                                            selectionMode="multiple"
                                            onSelectionChange={(selected) => handleSelectionChange(selected as Set<string>)}
                                            defaultSelectedKeys={product.composedByProducts.map(composition => composition.componentProduct.id)}
                                        >
                                            {
                                                products
                                                    // .filter(product => product.type === "RawMaterial")
                                                    .filter(item => item.id !== product.id)
                                                    .map(item => (
                                                        <SelectItem key={item.id}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))
                                            }
                                        </Select>

                                        {/* Renderiza los inputs de cantidad */}
                                        <div className="ml-1 mt-1 space-y-4">
                                            {selectedProducts.map((product) => (
                                                <div key={product.id} className="flex flex-wrap gap-0 mb-1 items-center">
                                                    {/* <span className="w-full md:w-auto">{products.find((p) => p.id === product.id)?.name}</span> */}
                                                    <Input
                                                        name={`quantities[${product.id}]`}
                                                        label={products.find((p) => p.id === product.id)?.name}
                                                        type="number"
                                                        variant="flat"
                                                        defaultValue={product.quantity.toString()}
                                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                        placeholder="Cantidad"
                                                        endContent={(products.find(prod => prod.id === product.id))?.unit?.abbreviation || ''}
                                                        min="1"
                                                        step="0.01"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="gap-4">
                                    <h2 className="font-semibold">Selecciona imagen</h2>
                                    <Input
                                        name="productImage"
                                        label="Imagen"
                                        placeholder="Selecciona una imagen"
                                        type="file"
                                        variant="underlined"
                                        onChange={handleImageChange}
                                    />

                                    {/* Previsualización de la imagen */}
                                    <div className='relative mt-4 w-full h-[200px] flex items-center justify-center'>
                                        <Image
                                            src={imageError ? warning_error_image : previewImage || no_image}
                                            alt='Vista previa'
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className='rounded-lg object-contain'
                                            onError={() => setImageError(true)}
                                        />
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button color='danger' variant='light' onPress={onClose}>Cancelar</Button>
                                <Button
                                    type='submit'
                                    color='primary'
                                    className='block'
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                >
                                    Actualizar
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
