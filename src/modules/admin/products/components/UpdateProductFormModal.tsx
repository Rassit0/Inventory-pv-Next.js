"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { IBranchProductInventory, InventoryByBranchForm, IProduct, updateProduct } from '@/modules/admin/products';
import { ISimpleCategory } from '@/modules/admin/categories';
import { ISimpleHandlingUnit } from '@/modules/admin/handling-units';
import { toast } from 'sonner';
import { Button, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, useDisclosure } from '@heroui/react';
import { Delete01Icon, PencilEdit01Icon, PlusSignIcon } from 'hugeicons-react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { IBranch } from '@/modules/admin/branches';
import { parseAbsolute } from '@internationalized/date';
import { IWarehouse } from '@/modules/admin/warehouses';

interface Props {
    product: IProduct,
    categories: ISimpleCategory[];
    handlingUnits: ISimpleHandlingUnit[];
    branches: IBranch[];
}

interface SelectedProduct {
    id: string;
    quantity: number;
}
export const UpdateProductFormModal = ({ product, categories, handlingUnits, branches }: Props) => {

    // Form
    const [productName, setProductName] = useState(product.name);
    const [productDescription, setProductDescription] = useState(product.description);
    const [productIsEnable, setProductIsEnable] = useState(true);

    const [imageError, setImageError] = useState(false);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [branchProductInventory, setBranchProductInventory] = useState<IBranchProductInventory[]>(product.branchProductInventory)
    const [backupBranchProductInventory, setBackupBranchProductInventory] = useState<IBranchProductInventory[]>(product.branchProductInventory)
    const [availableBranches, setAvailableBranches] = useState<IBranch[]>(branches.filter(branch => !product.branchProductInventory.some(inventory => inventory.branchId === branch.id))); // Sucursales disponibles

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setBranchProductInventory(product.branchProductInventory)
    }, [product])


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setPreviewImage(fileURL);
        } else {
            setPreviewImage(null);
        }
    }

    const handleBranchInventoryChange = (branchId: string, field: keyof IBranchProductInventory, value: string) => {
        setBranchProductInventory((prev) => {
            const updatedInventory = [...prev];
            const inventoryIndex = updatedInventory.findIndex((inventory) => inventory.branchId === branchId);
            if (inventoryIndex >= 0) {
                updatedInventory[inventoryIndex] = {
                    ...updatedInventory[inventoryIndex],
                    [field]: value
                };
            }
            return updatedInventory;
        });
    };

    const handleAddBranchForm = (branchId: string) => {
        // Verificar que la sucursal no esté ya agregada
        const isBranchAlreadyAdded = branchProductInventory.some((inventory) => inventory.branchId === branchId);
        if (isBranchAlreadyAdded) return;


        // Buscar si la sucursal ya tiene un inventario en el producto
        const existingInventory = product.branchProductInventory.find(p => p.branchId === branchId);

        // Agregar el inventario para la sucursal seleccionada
        setBranchProductInventory((prev) => [
            ...prev,
            existingInventory ?? {
                branchId,
                stock: "",
                minimumStock: "",
                reorderPoint: "",
                warehouseId: "",
                lastStockUpdate: new Date(),
                purchasePriceOverride: null,
                priceOverride: null
            },
        ]);

        // Eliminar la sucursal seleccionada de la lista de sucursales disponibles
        setAvailableBranches((prev) => prev.filter(branch => branch.id !== branchId));
    };

    const handleRemoveBranchForm = (branchId: string) => {
        // Eliminar el formulario de sucursal de la lista de inventarios
        setBranchProductInventory((prev) => {
            const updatedInventory = prev.filter(inventory => inventory.branchId !== branchId);
            return updatedInventory;
        });

        // Restaurar la sucursal eliminada a la lista de sucursales disponibles
        const branch = branches.find((branch) => branch.id === branchId);
        if (branch) {
            setAvailableBranches((prev) => {
                const updatedBranches = [...prev, branch];

                // Ordenar las sucursales por 'name' al restaurar
                return updatedBranches.sort((a, b) => a.name.localeCompare(b.name));
            });
        }
    };

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

    const handleRestoreInventory = () => {

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
            <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='outside' placement='top' size='4xl'>
                <Form
                    validationBehavior="native"
                    onSubmit={handleSubmit}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>Editar Producto</ModalHeader>

                                <ModalBody className='w-full'>
                                    <div className="w-full">
                                        <h2 className="font-semibold">Datos generales</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                                            <Input
                                                isRequired
                                                name="productName"
                                                label="Nombre"
                                                placeholder="Agrega un nombre a el producto"
                                                variant="underlined"
                                                value={productName}
                                                onChange={(e) => setProductName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === ' ' || e.key === 'Enter') setProductName(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                                                }}
                                                onBlur={() => {
                                                    setProductName(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                                                }}
                                            />

                                            <Input
                                                isRequired
                                                name="productDescription"
                                                label="Descripción"
                                                placeholder="Agrega una descripción a el producto"
                                                variant="underlined"
                                                value={productDescription}
                                                onChange={(e) => setProductDescription(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === ' ' || e.key === 'Enter') setProductDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                                                }}
                                                onBlur={() => {
                                                    setProductDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                                                }}
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
                                                defaultValue={product.price}
                                            />

                                            <Select
                                                isRequired
                                                name="productUnitId"
                                                label='Unidad de manejo'
                                                placeholder="Selecciona la unidad de manejo"
                                                variant="underlined"
                                                defaultSelectedKeys={[product.unit.id]}
                                            >
                                                {
                                                    handlingUnits.map(unit => (
                                                        <SelectItem key={unit.id}>{unit.name}</SelectItem>
                                                    ))
                                                }
                                            </Select>

                                            <DatePicker
                                                name="productLaunchDate"
                                                granularity='day'
                                                label="Fecha de lanzamiento"
                                                variant="underlined"
                                                defaultValue={product.launchDate ? parseAbsolute(product.launchDate.toISOString(), 'America/La_Paz') : undefined}
                                            />

                                            <DatePicker
                                                name="productExpirationDate"
                                                granularity='day'
                                                label="Fecha de expiración"
                                                variant="underlined"
                                                defaultValue={product.expirationDate ? parseAbsolute(product.expirationDate.toISOString(), 'America/La_Paz') : undefined}
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

                                            <Select
                                                isRequired
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
                                            <input type="hidden" name="productIsEnable" value={productIsEnable ? 'true' : 'false'} />
                                            <Switch
                                                className='pt-4'
                                                defaultSelected
                                                color="success"
                                                size="sm"
                                                isSelected={productIsEnable}
                                                onValueChange={(value) => setProductIsEnable(value)}
                                            >
                                                Activo
                                            </Switch>
                                        </div>
                                    </div>

                                    {/* Formulario de inventario por sucursal */}
                                    <InventoryByBranchForm
                                        availableBranches={availableBranches}
                                        branchProductInventory={branchProductInventory}
                                        setBranchProductInvetory={setBranchProductInventory}
                                        branches={branches}
                                        handleAddBranchForm={handleAddBranchForm}
                                        handleBranchInventoryChange={handleBranchInventoryChange}
                                        handleRemoveBranchForm={handleRemoveBranchForm}
                                        product={product}
                                    />

                                    <div className="w-full gap-4 p-2">
                                        <h2 className="font-semibold">Selecciona imagen</h2>
                                        <Input
                                            name="productImage"
                                            label="Imagen"
                                            placeholder="Selecciona una imagen del producto"
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
                            </>
                        )}
                    </ModalContent>
                </Form>
            </Modal>
        </>
    )
}
