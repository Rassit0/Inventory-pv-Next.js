"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import { DetailsStockModal, IBranchProductStock, InventoryByBranchForm, IProduct, IProductsResponse, updateProduct } from '@/modules/admin/products';
import { ISimpleCategory } from '@/modules/admin/categories';
import { ISimpleHandlingUnit } from '@/modules/admin/handling-units';
import { toast } from 'sonner';
import { Button, Checkbox, CheckboxGroup, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, Textarea, Tooltip, useDisclosure } from '@heroui/react';
import { Delete01Icon, PencilEdit01Icon, PencilEdit02Icon, PlusSignIcon } from 'hugeicons-react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { IBranch } from '@/modules/admin/branches';
import { parseAbsolute } from '@internationalized/date';
import { IWarehouse } from '@/modules/admin/warehouses';
import { ImageUploaderInput, useUIStore } from "@/modules/admin/shared";
import { useSessionStore } from '@/modules/auth';
import { ISupplier } from '@/modules/admin/suppliers';
import { IRecipe } from '@/modules/admin/production-recipes';

interface Props {
    recipe: IRecipe;
    productsResponse: IProductsResponse
    branches: IBranch[];
    warehouses: IWarehouse[];
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
    onClose: () => void;

}

interface SelectedProduct {
    id: string;
    quantity: number;
}
export const UpdateRecipeFormModal = ({ recipe, branches, productsResponse, warehouses, isOpen, onClose, onOpen, onOpenChange }: Props) => {

    //Session
    const { token } = useSessionStore();

    // CONTROL DE LAS IMAGENES QUE TIENEN ERROR AL CARGAR
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    // useEffect(() => {
    //     setImageErrors({})
    // }, [warehouses])

    const handleImageError = (warehouseId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [warehouseId]: true,
        }));
    };
    //Form
    const [recipeName, setRecipeName] = useState(recipe.name);
    const [recipeDescription, setRecipeDescription] = useState(recipe.description);
    const [preparationInstructions, setPreparationInstructions] = useState(recipe.preparationInstructions);
    const [preparationTime, setPreparationTime] = useState('');
    const [recipeIsEnable, setRecipeIsEnable] = useState(true);
    const [transactionType, setTransactionType] = useState<string>("INCOME");
    const [adjustmentType, setAdjustmentType] = useState<string>("");
    const [selectOrigin, setSelectOrigin] = useState<string>('')
    const [selectDestiny, setSelectDestiny] = useState<string>('')
    const [branchDestiny, setBranchDestiny] = useState<Record<string, IBranch>>({})
    const [selectedBranchOrigin, setSelectedBranchOrigin] = useState<IBranch | null>(null);
    const [selectedWarehouseOrigin, setSelectedWarehouseOrigin] = useState<IWarehouse | null>(null);
    const [selectedBranchDestiny, setSelectedBranchDestiny] = useState<IBranch | null>(null);
    const [selectedWarehouseDestiny, setSelectedWarehouseDestiny] = useState<IWarehouse | null>(null);
    const { branchId } = useUIStore();

    useEffect(() => {
        setSelectDestiny('');
        setSelectOrigin('');
        if (transactionType === 'OUTCOME') {
            setSelectOrigin('branch');
        }
        if (transactionType !== 'ADJUSTMENT') {
            setAdjustmentType('')
        }
        setSelectedBranchOrigin(null)
        setSelectedWarehouseOrigin(null)
        setSelectedBranchDestiny(null)
        setSelectedWarehouseDestiny(null)
    }, [transactionType])



    // useEffect(() => {
    //     if (transactionType !== 'ADJUSTMENT') {
    //         setAdjustmentType('')
    //     }
    // }, [transactionType])

    // Form de stock por products
    // Productos removidos de la tabla
    const [removedProductsTable, setRemovedProductsTable] = useState<IProduct[]>([]);

    useEffect(() => {
        /// Filtrar productos solo si hay sucursal o almacén seleccionado
        const filteredProducts = removedProductsTable.filter(p => {
            const hasBranchStock = selectedBranchOrigin ?
                p.branchProductStock.some(b => b.branchId === selectedBranchOrigin.id) : false;
            const hasWarehouseStock = selectedWarehouseOrigin ?
                p.warehouseProductStock.some(w => w.warehouseId === selectedWarehouseOrigin.id) : false;

            // Devolver el producto solo si tiene stock en la sucursal o el almacén
            return hasBranchStock || hasWarehouseStock;
        });
        setRemovedProductsTable(filteredProducts)

    }, [selectedBranchOrigin, selectedWarehouseOrigin])


    useEffect(() => {
        setSelectedBranchOrigin(null)
        setSelectedWarehouseOrigin(null)


    }, [selectOrigin])

    const handleOpenModatProductsTable = () => {
        if (!selectedBranchOrigin && !selectedWarehouseOrigin && (transactionType === 'TRANSFER' || (adjustmentType === 'OUTCOME'))) {
            toast.error("Debe seleccionar una sucursal o almacén de origen");
            return
        }
        onOpen();
    }
    const handleRemoveProduct = (product: IProduct) => {
        setRemovedProductsTable(prev => [...prev, product]); // Agrega a eliminados
    };
    const handleRestoreProduct = (productId: string) => {
        setRemovedProductsTable((prev) => prev.filter((p) => p.id !== productId)); // Quita de eliminados
    };

    const [imageError, setImageError] = useState(false);

    // const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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
        const { error, message, response } = await updateProduct({ formData, productId: recipe.id, token: token || '' });
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
            setPreviewImage(recipe.imageUrl || null);
        }
    }, [isOpen, recipe.imageUrl]);

    // useEffect(() => {
    //     onOpen()
    // }, [])
    return (
        <>
            {/* <Button
                onPress={onOpen}
                className='w-full'
                // isIconOnly
                color='warning'
                variant='light'
                radius='full'
                startContent={<PencilEdit01Icon />}
            /> */}
            {/* <DropdownItem key="edit" onPress={onOpen} startContent={<PencilEdit02Icon />}>
                Editar
            </DropdownItem> */}
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
                                    <div className="grid md:grid-cols-3 w-full">
                                        <div className="w-full gap-4 p-2 md:col-span-1">
                                            <h2 className="font-semibold">Imagen de presentación</h2>
                                            <div className='flex flex-col justify-between h-full pb-4'>
                                                <ImageUploaderInput name='recipeImage' />
                                            </div>
                                        </div>
                                        <div className="w-full md:col-span-2">
                                            <h2 className="font-semibold">Datos generales</h2>
                                            <div className="grid grid-cols-1 gap-4 p-2">
                                                <Input
                                                    isRequired
                                                    name="recipeName"
                                                    label="Nombre"
                                                    placeholder="Agrega un nombre a la receta"
                                                    variant="underlined"
                                                    value={recipeName}
                                                    onChange={(e) => setRecipeName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === ' ' || e.key === 'Enter') setRecipeName(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                                                    }}
                                                    onBlur={() => {
                                                        setRecipeName(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                                                    }}
                                                />
                                                <Textarea
                                                    // key={productDescription}
                                                    // disableAnimation
                                                    // disableAutosize
                                                    name="recipeDescription"
                                                    classNames={{
                                                        // base: "max-w-xs",
                                                        input: "resize-y min-h-[20px]",
                                                    }}
                                                    label="Descripción"
                                                    labelPlacement="outside"
                                                    placeholder="Agrega una descripción"
                                                    variant='underlined'
                                                    value={recipeDescription}
                                                    onChange={(e) => setRecipeDescription(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === ' ' || e.key === 'Enter') setRecipeDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                                                    }}
                                                    onBlur={() => {
                                                        setRecipeDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                                                    }}
                                                />

                                                <Textarea
                                                    // key={productDescription}
                                                    // disableAnimation
                                                    // disableAutosize
                                                    name="recipePreparationInstructions"
                                                    classNames={{
                                                        // base: "max-w-xs",
                                                        input: "resize-y min-h-[20px]",
                                                    }}
                                                    label="Instrucciones de preparación"
                                                    labelPlacement="outside"
                                                    placeholder="Agrega instrucciones"
                                                    variant='underlined'
                                                    value={preparationInstructions}
                                                    onChange={(e) => setPreparationInstructions(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === ' ' || e.key === 'Enter') setPreparationInstructions(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                                                    }}
                                                    onBlur={() => {
                                                        setPreparationInstructions(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                                                    }}
                                                />

                                                <Input
                                                    isRequired
                                                    name='recipePreparationTime'
                                                    label='Tiempo de preparación'
                                                    // placeholder='Ingrese el nombre del contacto'
                                                    variant='underlined'
                                                    type='number'
                                                    endContent={<span className='text-default-500'>min.</span>}
                                                    value={preparationTime}
                                                    onChange={(e) => setPreparationTime(e.target.value)}
                                                />

                                                <input type="hidden" name="recipeIsEnable" value={recipeIsEnable ? 'true' : 'false'} />
                                                <div className="p-2">
                                                    <Switch
                                                        className='pt-4'
                                                        defaultSelected
                                                        color="success"
                                                        size="sm"
                                                        isSelected={recipeIsEnable}
                                                        onValueChange={(value) => setRecipeIsEnable(value)}
                                                    >
                                                        Activo
                                                    </Switch>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className='space-y-4'>
                                        {removedProductsTable.map((product, index) => (
                                            <div key={`formStock-${index}`} className='hover:bg-primary-100 bg-primary-50 rounded-lg'>
                                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4 p-2 sm:pt-0'>
                                                    <div className='flex flex-row items-center'>
                                                        {/* <h3 className='font-semibold'>Producto: {product.name}</h3> */}

                                                        <div className="flex gap-2 items-center cursor-pointer">
                                                            <div className='min-w-10'>
                                                                <Image
                                                                    src={imageErrors[product.id] ? warning_error_image : product.imageUrl || no_image}
                                                                    alt='Vista previa'
                                                                    sizes="35px"
                                                                    // style={{
                                                                    //     width: '100%',
                                                                    //     height: 'auto',
                                                                    // }}
                                                                    width={35}
                                                                    height={35}
                                                                    className='rounded-lg object-contain'
                                                                    onError={() => handleImageError(product.id)}
                                                                />
                                                            </div>
                                                            <div className="flex-col min-w-0 flex">
                                                                <span className="text-small">{product?.name}</span>
                                                                <span className="text-tiny text-default-400 truncate">{product.description}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <input type="hidden" name='productIds' value={product.id} />
                                                    {/* <input type="hidden" name={`unitNameProduct[${product.id}]`} value={product.unit.name} /> */}
                                                    <Input
                                                        isRequired
                                                        name={`product-quantity[${product.id}]`}
                                                        label='Cantidad'
                                                        // placeholder='Ingrese el nombre del contacto'
                                                        variant='underlined'
                                                        type='number'
                                                    />
                                                </div>
                                                <div className='space-x-2'>
                                                    <DetailsStockModal product={product} />
                                                    <Tooltip color="danger" content="Remover producto" delay={1000}>
                                                        <Button
                                                            isIconOnly
                                                            radius='full'
                                                            size='sm'
                                                            color='danger'
                                                            className='mt-4'
                                                            variant='light'
                                                            startContent={<Delete01Icon />}
                                                            onPress={() => handleRestoreProduct(product.id)}
                                                        />
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        ))}
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
