"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { IBranchProductStock, InventoryByBranchForm, IProduct, updateProduct } from '@/modules/admin/products';
import { ISimpleCategory } from '@/modules/admin/categories';
import { ISimpleHandlingUnit } from '@/modules/admin/handling-units';
import { toast } from 'sonner';
import { Button, Checkbox, CheckboxGroup, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, Textarea, useDisclosure } from '@heroui/react';
import { Delete01Icon, PencilEdit01Icon, PlusSignIcon } from 'hugeicons-react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { IBranch } from '@/modules/admin/branches';
import { parseAbsolute } from '@internationalized/date';
import { IWarehouse } from '@/modules/admin/warehouses';
import { ImageUploaderInput } from "@/modules/admin/shared";
import { useSessionStore } from '@/modules/auth';
import { ISupplier } from '@/modules/admin/suppliers';

interface Props {
    product: IProduct,
    categories: ISimpleCategory[];
    handlingUnits: ISimpleHandlingUnit[];
    branches: IBranch[];
    suppliers: ISupplier[];
}

interface SelectedProduct {
    id: string;
    quantity: number;
}
export const UpdateProductFormModal = ({ product, categories, handlingUnits, branches, suppliers }: Props) => {

    //Session
    const { token } = useSessionStore();

    // Form
    const [productName, setProductName] = useState(product.name);
    const [productDescription, setProductDescription] = useState(product.description);
    const [productIsEnable, setProductIsEnable] = useState(product.isEnable);
    const [handlingUnitId, setHandlingUnitId] = useState(product.unit.id || '');

    const [imageError, setImageError] = useState(false);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [branchProductStock, setBranchProductStock] = useState<IBranchProductStock[]>(product.branchProductStock)
    const [backupBranchProductInventory, setBackupBranchProductInventory] = useState<IBranchProductStock[]>(product.branchProductStock)
    const [availableBranches, setAvailableBranches] = useState<IBranch[]>(branches.filter(branch => !product.branchProductStock.some(inventory => inventory.branchId === branch.id))); // Sucursales disponibles

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setBranchProductStock(product.branchProductStock)
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

    const handleBranchInventoryChange = (branchId: string, field: keyof IBranchProductStock, value: string) => {
        setBranchProductStock((prev) => {
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

    // const handleAddBranchForm = (branchId: string) => {
    //     // Verificar que la sucursal no esté ya agregada
    //     const isBranchAlreadyAdded = branchProductStock.some((inventory) => inventory.branchId === branchId);
    //     if (isBranchAlreadyAdded) return;


    //     // Buscar si la sucursal ya tiene un inventario en el producto
    //     const existingInventory = product.branchProductStock.find(p => p.branchId === branchId);

    //     // Agregar el inventario para la sucursal seleccionada
    //     setBranchProductStock((prev) => [
    //         ...prev,
    //         existingInventory ?? {
    //             branchId,
    //             stock: "",
    //             minimumStock: "",
    //             reorderPoint: "",
    //             warehouseId: "",
    //             lastStockUpdate: new Date(),
    //             purchasePriceOverride: null,
    //             priceOverride: null
    //         },
    //     ]);

    //     // Eliminar la sucursal seleccionada de la lista de sucursales disponibles
    //     setAvailableBranches((prev) => prev.filter(branch => branch.id !== branchId));
    // };

    const handleRemoveBranchForm = (branchId: string) => {
        // Eliminar el formulario de sucursal de la lista de inventarios
        setBranchProductStock((prev) => {
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
        const { error, message, response } = await updateProduct({ formData, productId: product.id, token: token || '' });
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
                                    <div className='grid grid-cols-1 md:grid-cols-3 overflow-hidden'>
                                        <div className="w-full gap-4 p-2 md:col-span-1">
                                            <h2 className="font-semibold">Imagen de presentación</h2>
                                            <div className='flex flex-col justify-between h-full pb-4'>
                                                <ImageUploaderInput name='productImage' imageDefault={product.imageUrl || undefined} />
                                            </div>
                                        </div>
                                        <div className="w-full md:col-span-2">
                                            <h2 className="font-semibold">Datos generales</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
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

                                                {/* <Select
                                                    isRequired
                                                    name="productType"
                                                    label='Tipo de Producto'
                                                    placeholder="Selecciona el tipo de producto"
                                                    variant="underlined"
                                                    defaultSelectedKeys={[product.type]}
                                                >
                                                    <SelectItem key={'FinalProduct'}>Producto Final</SelectItem>
                                                    <SelectItem key={'RawMaterial'}>Insumo</SelectItem>
                                                </Select> */}

                                                <Select
                                                    isRequired
                                                    name="productUnitId"
                                                    label='Unidad de manejo'
                                                    placeholder="Selecciona la unidad de manejo"
                                                    variant="underlined"
                                                    selectedKeys={[handlingUnitId]}
                                                    onChange={(e) => setHandlingUnitId(e.target.value)}
                                                >
                                                    {
                                                        handlingUnits.map(unit => (
                                                            <SelectItem key={unit.id}>{unit.name}</SelectItem>
                                                        ))
                                                    }
                                                </Select>

                                                <Select
                                                    // isRequired
                                                    name="supplierIds"
                                                    label="Proveedor(s)"
                                                    placeholder="Seleccione el proveedor(s) del producto"
                                                    variant="underlined"
                                                    selectionMode="multiple"
                                                    defaultSelectedKeys={product.suppliersProduct.map(supplier => supplier.supplierId)}
                                                >
                                                    {
                                                        suppliers.map(supplier => (
                                                            <SelectItem key={supplier.id}>{supplier.name}</SelectItem>
                                                        ))
                                                    }
                                                </Select>

                                                <Input
                                                    isRequired
                                                    min={1}
                                                    name='minimumStockProduct'
                                                    label="Stock minimo"
                                                    type="number"
                                                    variant="underlined"
                                                    endContent={<div className="text-default-400">{handlingUnits.find(unit => unit.id === handlingUnitId)?.abbreviation}</div>}
                                                    defaultValue={product.minimumStock}
                                                />

                                                <Input
                                                    isRequired
                                                    min={1}
                                                    name='reorderPointProduct'
                                                    label="Punto de reorden"
                                                    type="number"
                                                    variant="underlined"
                                                    endContent={<div className="text-default-400">{handlingUnits.find(unit => unit.id === handlingUnitId)?.abbreviation}</div>}
                                                    defaultValue={product.reorderPoint}
                                                />

                                                {/* <DatePicker
                                                    name="productLaunchDate"
                                                    granularity='day'
                                                    label="Fecha de ingreso"
                                                    variant="underlined"
                                                    defaultValue={product.launchDate ? parseAbsolute(product.launchDate.toISOString(), 'America/La_Paz') : undefined}
                                                />

                                                <DatePicker
                                                    name="productExpirationDate"
                                                    granularity='day'
                                                    label="Fecha de expiración"
                                                    variant="underlined"
                                                    defaultValue={product.expirationDate ? parseAbsolute(product.expirationDate.toISOString(), 'America/La_Paz') : undefined}
                                                /> */}

                                                {/* <Input
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
                                                /> */}
                                                <Textarea
                                                    name='productDescription'
                                                    classNames={{
                                                        // base: "max-w-xs",
                                                        input: "resize-y min-h-[40px]",
                                                    }}
                                                    label="Descripción"
                                                    labelPlacement="outside"
                                                    placeholder="Agrega una descripción"
                                                    variant='underlined'
                                                    value={productDescription}
                                                    onChange={(e) => setProductDescription(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === ' ' || e.key === 'Enter') setProductDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                                                    }}
                                                    onBlur={() => {
                                                        setProductDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                                                    }}
                                                />

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
                                            <CheckboxGroup className='p-4' orientation='horizontal' isRequired name='productType' defaultValue={product.types.map(type => type.type)}>
                                                <Checkbox value="FinalProduct">Producto</Checkbox>
                                                <Checkbox value="Supply">Insumo</Checkbox>
                                                <Checkbox value="RawMaterial">Materia Prima</Checkbox>
                                                {/* <Checkbox value="Recipe">Receta/Servicio/Combo</Checkbox> */}
                                            </CheckboxGroup>
                                        </div>
                                    </div>

                                    {/* Formulario de inventario por sucursal */}
                                    {/* <InventoryByBranchForm
                                        availableBranches={availableBranches}
                                        branchProductStock={branchProductStock}
                                        setBranchProductInvetory={setBranchProductStock}
                                        branches={branches}
                                        handleAddBranchForm={handleAddBranchForm}
                                        handleBranchInventoryChange={handleBranchInventoryChange}
                                        handleRemoveBranchForm={handleRemoveBranchForm}
                                        product={product}
                                        handlingUnitAbbreviation={handlingUnits.find(unit => unit.id === handlingUnitId)?.abbreviation || ''}
                                    /> */}


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
