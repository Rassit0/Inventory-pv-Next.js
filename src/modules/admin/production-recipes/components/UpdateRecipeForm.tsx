"use client"
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Textarea, Tooltip, useDisclosure } from '@heroui/react'
import React, { FormEvent, useEffect, useState } from 'react'
import { ISupplierContactInfo } from '@/modules/admin/suppliers';
import { Add01Icon, Delete01Icon } from 'hugeicons-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DetailsStockModal, findProduct, getProducts, IProduct, IProductsResponse, SelectProductTable } from '@/modules/admin/products';
import { IBranch } from '@/modules/admin/branches';
import { IWarehouse } from '@/modules/admin/warehouses';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { ImageUploaderInput, useUIStore } from '../../shared';
import { createRecipe, IRecipe, updateRecipe } from '@/modules/admin/production-recipes';

interface Props {
    token: string;
    recipe: IRecipe;
    productsResponse: IProductsResponse
    branches: IBranch[];
    warehouses: IWarehouse[];
}

export const UpdateRecipeForm = ({ token, productsResponse, recipe }: Props) => {
    const router = useRouter();

    // MODAL
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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

    const [supplierIsActive, setSupplierIsActive] = useState<boolean>(true);
    const [contacts, setContacts] = useState<ISupplierContactInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    //Form
    const [recipeName, setRecipeName] = useState(recipe.name);
    const [recipeDescription, setRecipeDescription] = useState(recipe.description || '');
    const [preparationInstructions, setPreparationInstructions] = useState(recipe.preparationInstructions || '');
    const [preparationTime, setPreparationTime] = useState(recipe.preparationTime || '');
    const [recipeIsEnable, setRecipeIsEnable] = useState(recipe.isEnable);
    const [transactionType, setTransactionType] = useState<string>("INCOME");
    const [adjustmentType, setAdjustmentType] = useState<string>("");
    const [selectOrigin, setSelectOrigin] = useState<string>('')
    const [selectDestiny, setSelectDestiny] = useState<string>('')
    const [branchDestiny, setBranchDestiny] = useState<Record<string, IBranch>>({})
    // const [selectedBranchOrigin, setSelectedBranchOrigin] = useState<IBranch | null>(null);
    // const [selectedWarehouseOrigin, setSelectedWarehouseOrigin] = useState<IWarehouse | null>(null);
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
        // setSelectedBranchOrigin(null)
        // setSelectedWarehouseOrigin(null)
        setSelectedBranchDestiny(null)
        setSelectedWarehouseDestiny(null)
    }, [transactionType])


    // Form de stock por products
    // Productos removidos de la tabla
    const [removedProductsTable, setRemovedProductsTable] = useState<IProduct[]>([]);
    useEffect(() => {
        const fetchRemovedProducts = async () => {
            if (recipe?.items?.length) {
                // Extraer todos los `productIds` de los items de la receta
                const productIds = recipe.items.map(item => item.productId);

                try {
                    // Llamar a `getProducts` con los `productIds`
                    const response = await getProducts({
                        token,
                        productIds // Enviar los productIds en la solicitud
                    });
                    console.log(response)

                    if (response.products && response.products.length > 0) {
                        setRemovedProductsTable(response.products);
                    }
                } catch (error) {
                    console.error('Error fetching removed products:', error);
                }
            }
        };

        fetchRemovedProducts();
    }, [recipe, token]); // Se ejecuta cuando `recipe` o `token` cambian


    // useEffect(() => {
    //     /// Filtrar productos solo si hay sucursal o almacén seleccionado
    //     const filteredProducts = removedProductsTable.filter(p => {
    //         const hasBranchStock = selectedBranchOrigin ?
    //             p.branchProductStock.some(b => b.branchId === selectedBranchOrigin.id) : false;
    //         const hasWarehouseStock = selectedWarehouseOrigin ?
    //             p.warehouseProductStock.some(w => w.warehouseId === selectedWarehouseOrigin.id) : false;

    //         // Devolver el producto solo si tiene stock en la sucursal o el almacén
    //         return hasBranchStock || hasWarehouseStock;
    //     });
    //     setRemovedProductsTable(filteredProducts)

    // }, [selectedBranchOrigin, selectedWarehouseOrigin])


    // useEffect(() => {
    //     setSelectedBranchOrigin(null)
    //     setSelectedWarehouseOrigin(null)


    // }, [selectOrigin])

    const handleOpenModatProductsTable = () => {
        // if (!selectedBranchOrigin && !selectedWarehouseOrigin && (transactionType === 'TRANSFER' || (adjustmentType === 'OUTCOME'))) {
        //     toast.error("Debe seleccionar una sucursal o almacén de origen");
        //     return
        // }
        onOpen();
    }
    const handleRemoveProduct = (product: IProduct) => {
        setRemovedProductsTable(prev => [...prev, product]); // Agrega a eliminados
    };
    const handleRestoreProduct = (productId: string) => {
        setRemovedProductsTable((prev) => prev.filter((p) => p.id !== productId)); // Quita de eliminados
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        if (removedProductsTable.length <= 0) {
            toast.error("Debe agregar productos a la receta.")
            setIsLoading(false);
            return;
        }

        let hasError = false;

        if (hasError) {
            setIsLoading(false);
            return;
        };


        setIsLoading(false);

        const formData = new FormData(e.currentTarget);
        // const dataArray: any[] = [];
        // formData.forEach((value, key) => {
        //     dataArray.push({ key, value });
        // });
        // console.log(dataArray)
        // return;
        const { error, message, response } = await updateRecipe({ recipeId: recipe.id, token, formData });
        if (error) {
            if (response && Array.isArray(response.message)) {
                // Itera sobre cada mensaje en response.message y muestra un toast para cada uno
                response.message.forEach((msg: string) => {  // Aquí se define el tipo de 'msg'
                    toast.warning("Ocurrió un error", {
                        description: msg
                    });
                });
            } else {
                // Si no es un arreglo, muestra un solo toast con el mensaje
                toast.warning("Ocurrió un error", {
                    description: response ? response.message : message
                });
            }

            setIsLoading(false);
            return;
        }

        // Si se guarda con exito
        toast.success(message);
        setIsLoading(false);
        router.push('/admin/production/recipes');

        return;
    }
    return (
        <Form
            validationBehavior='native'
            className="bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded"
            onSubmit={handleSubmit}
        >
            <div className='flex justify-between w-full'>
                <h2 className='text-2xl font-semibold'>Formulario</h2>
                <Button
                    onPress={handleOpenModatProductsTable}
                    color='primary'
                    startContent={<Add01Icon />}
                    radius='full'
                    variant='light'
                // isDisabled={(transactionType === 'TRANSFER' || adjustmentType === 'OUTCOME') && (selectedBranchOrigin === null && selectedWarehouseOrigin === null) ? true : false}
                ><div className='hidden sm:flex'>Producto</div></Button>
            </div>

            {/* <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'> */}
            <div className='w-full grid grid-cols-1 gap-4'>
                {/* <div className="w-full">
                    <h2 className='font-semibold'>Datos generales</h2> */}

                <div className="grid grid-cols-1 gap-4">
                    <div className="grid md:grid-cols-3 w-full">
                        <div className="w-full gap-4 p-2 md:col-span-1">
                            <h2 className="font-semibold">Imagen de presentación</h2>
                            <div className='flex flex-col justify-between h-full pb-4'>
                                <ImageUploaderInput name='recipeImage' imageDefault={recipe.imageUrl || undefined} />
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
                                    value={preparationTime.toString()}
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
                                        endContent={<span className='text-default-500'>{product.unit.abbreviation}</span>}
                                        defaultValue={recipe.items.find(item => item.productId === product.id)?.quantity || ''}
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

                </div>
            </div>

            <Button
                type='submit'
                color='primary'
                isLoading={isLoading}
                isDisabled={isLoading}
            >
                Actualizar Receta
            </Button>

            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                // placement='top'
                scrollBehavior='outside'
                size='4xl'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Agregar Producto</ModalHeader>
                            <ModalBody className='w-full'>
                                <SelectProductTable
                                    token={token}
                                    defaultProductsIds={recipe.items && recipe.items.length > 0 ? recipe.items.map(i => i.productId) : undefined}
                                    productsResponse={productsResponse}
                                    onRemoveProduct={handleRemoveProduct} // Ahora recibe la función correcta
                                    removedProducts={removedProductsTable} // Enviamos la lista de eliminados
                                    // searchBranchId={selectedBranchOrigin?.id ?? undefined}
                                    // searchWarehouseId={selectedWarehouseOrigin?.id ?? undefined}
                                    // filterByLocationId={selectedBranchOrigin?.id ?? selectedWarehouseOrigin?.id ?? undefined}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Aceptar
                                </Button>
                                {/* <Button color="primary" onPress={onClose}>
                                    Action
                                </Button> */}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Form >
    )
}
