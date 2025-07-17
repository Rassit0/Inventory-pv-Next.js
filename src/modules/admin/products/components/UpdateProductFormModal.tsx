"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { IProduct, updateProduct } from '@/modules/admin/products';
import { ISimpleCategory } from '@/modules/admin/categories';
import { ISimpleHandlingUnit } from '@/modules/admin/handling-units';
import { toast } from 'sonner';
import { Button, Checkbox, CheckboxGroup, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, SharedSelection, Switch, Textarea, useDisclosure } from '@heroui/react';
import { Delete01Icon, PencilEdit01Icon, PlusSignIcon } from 'hugeicons-react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { IBranch } from '@/modules/admin/branches';
import { parseAbsolute } from '@internationalized/date';
import { IWarehouse } from '@/modules/admin/warehouses';
import { ImageUploaderInput } from "@/modules/admin/shared";
import { useSessionStore } from '@/modules/auth';
import { ISupplier, ISuppliersResponse, SelectSearchSupplierAndCreate } from '@/modules/admin/suppliers';
import { IPersonsResponse } from '@/modules/admin/persons';

interface Props {
    token: string;
    product: IProduct,
    categories: ISimpleCategory[];
    handlingUnits: ISimpleHandlingUnit[];
    branches: IBranch[];
    supplierProps: {
        create?: {
            createSupplier: boolean;
            createContact: boolean;
            personsResponse: IPersonsResponse;
        };
        suppliersResponse: ISuppliersResponse;
    }
}

interface SelectedProduct {
    id: string;
    quantity: number;
}
export const UpdateProductFormModal = ({ product, categories, handlingUnits, branches, supplierProps, token }: Props) => {

    // Form
    const [productName, setProductName] = useState(product.name);
    const [productDescription, setProductDescription] = useState(product.description);
    const [productIsEnable, setProductIsEnable] = useState(product.isEnable);
    const [handlingUnitId, setHandlingUnitId] = useState<SharedSelection>(new Set([product.unit.id || '']));
    const [categorySelectedKeys, setCategorySelectedKeys] = useState<SharedSelection>(new Set(product.categories.map(category => category.id)));
    const [minimumStockProduct, setMinimumStockProduct] = useState<string>(product.minimumStock);
    const [reorderPointProduct, setReorderPointProduct] = useState<string>(product.reorderPoint);

    const [imageError, setImageError] = useState(false);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    // const [branchProductStock, setBranchProductStock] = useState<IBranchProductStock[]>(product.branchProductStock)
    // const [backupBranchProductInventory, setBackupBranchProductInventory] = useState<IBranchProductStock[]>(product.branchProductStock)
    // const [availableBranches, setAvailableBranches] = useState<IBranch[]>(branches.filter(branch => !product.branchProductStock.some(inventory => inventory.branchId === branch.id))); // Sucursales disponibles

    const [isLoading, setIsLoading] = useState(false);

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
                                                    selectedKeys={categorySelectedKeys}
                                                    onSelectionChange={setCategorySelectedKeys}
                                                // defaultSelectedKeys={product.categories.map(category => category.id)}
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
                                                    selectedKeys={handlingUnitId}
                                                    onSelectionChange={setHandlingUnitId}
                                                >
                                                    {
                                                        handlingUnits.map(unit => (
                                                            <SelectItem key={unit.id}>{unit.name}</SelectItem>
                                                        ))
                                                    }
                                                </Select>

                                                {/* <Select
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
                                                </Select> */}

                                                <Input
                                                    isRequired
                                                    min={1}
                                                    name='minimumStockProduct'
                                                    label="Stock minimo"
                                                    type="number"
                                                    variant="underlined"
                                                    endContent={<div className="text-default-400">{handlingUnits.find(unit => unit.id === handlingUnitId)?.abbreviation}</div>}
                                                    value={minimumStockProduct}
                                                    onValueChange={setMinimumStockProduct}
                                                />

                                                <Input
                                                    isRequired
                                                    min={1}
                                                    name='reorderPointProduct'
                                                    label="Punto de reorden"
                                                    type="number"
                                                    variant="underlined"
                                                    endContent={<div className="text-default-400">{handlingUnits.find(unit => unit.id === handlingUnitId)?.abbreviation}</div>}
                                                    value={reorderPointProduct}
                                                    onValueChange={setReorderPointProduct}
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
                                                    onValueChange={setProductDescription}
                                                    onKeyDown={(e) => {
                                                        if (e.key === ' ' || e.key === 'Enter') setProductDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                                                    }}
                                                    onBlur={() => {
                                                        setProductDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                                                    }}
                                                />

                                                <div className="md:col-span-3">
                                                    <SelectSearchSupplierAndCreate
                                                        // isRequired
                                                        token={token}
                                                        name={`productSuppliers`}
                                                        itemsResponse={supplierProps.suppliersResponse}
                                                        // selectedSingleKey={entry.supplierId ?? ''}
                                                        // onSelecteSingledItem={(value) => value && handleSupplierChange(item.id, index, value.id)}
                                                        defaultSelectedItemIds={product.suppliers.map(supplier => supplier.supplierId)}
                                                        create={supplierProps.create}
                                                        selectionMode='multiple'
                                                    />
                                                </div>

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
