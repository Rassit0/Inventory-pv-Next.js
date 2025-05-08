"use client"
import { Button, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Select, SelectItem, SharedSelection, Switch, Textarea, Tooltip, useDisclosure } from '@heroui/react'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { ISupplierContactInfo } from '@/modules/admin/suppliers';
import { Add01Icon, ArrowDown01Icon, CheckmarkCircle01Icon, Delete01Icon, PlusSignIcon } from 'hugeicons-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DetailsStockModal, IProduct, IProductsResponse, SelectProductTable } from '@/modules/admin/products';
import { IBranch, SelectAutocompleteBranches } from '@/modules/admin/branches';
import { IWarehouse, SelectAutocompleteWarehouses } from '@/modules/admin/warehouses';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { createMovement } from '@/modules/admin/inventory';
import { IPersonsResponse, SelectPersonAndCreate } from '@/modules/admin/persons';


interface Contact {
    id: number;
    name: string;
    phone?: string;
}

interface Props {
    token: string;
    productsResponse: IProductsResponse
    branches: IBranch[];
    warehouses: IWarehouse[];
    personsResponse: IPersonsResponse
}

export const CreateMovementInventoryForm = ({ token, productsResponse, branches, warehouses, personsResponse }: Props) => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const formRef = useRef<HTMLFormElement>(null);

    // CONTROL DE LAS IMAGENES QUE TIENEN ERROR AL CARGAR
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    useEffect(() => {
        setImageErrors({})
    }, [warehouses])

    const handleImageError = (warehouseId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [warehouseId]: true,
        }));
    };

    const [supplierIsActive, setSupplierIsActive] = useState<boolean>(true);
    const [contacts, setContacts] = useState<ISupplierContactInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // FORM
    const [movementType, setTransactionType] = useState<string>("INCOME");
    const [managerDeliveryType, setManagerDeliveryType] = useState<string>("supplier");
    const [adjustmentType, setAdjustmentType] = useState<string>("");
    const [selectOrigin, setSelectOrigin] = useState<string>('')
    const [selectDestiny, setSelectDestiny] = useState<string>('')
    const [branchDestiny, setBranchDestiny] = useState<Record<string, IBranch>>({})
    const [selectedBranchOrigin, setSelectedBranchOrigin] = useState<IBranch | null>(null);
    const [selectedWarehouseOrigin, setSelectedWarehouseOrigin] = useState<IWarehouse | null>(null);
    const [selectedBranchDestiny, setSelectedBranchDestiny] = useState<IBranch | null>(null);
    const [selectedWarehouseDestiny, setSelectedWarehouseDestiny] = useState<IWarehouse | null>(null);

    useEffect(() => {
        setSelectDestiny('');
        setSelectOrigin('');
        if (movementType === 'OUTCOME') {
            setSelectOrigin('branch');
        }
        if (movementType !== 'ADJUSTMENT') {
            setAdjustmentType('')
        }
        setSelectedBranchOrigin(null)
        setSelectedWarehouseOrigin(null)
        setSelectedBranchDestiny(null)
        setSelectedWarehouseDestiny(null)
    }, [movementType])



    // useEffect(() => {
    //     if (movementType !== 'ADJUSTMENT') {
    //         setAdjustmentType('')
    //     }
    // }, [movementType])

    // Form de stock por products
    // Productos removidos de la tabla
    const [removedProductsTable, setRemovedProductsTable] = useState<IProduct[]>([]);

    useEffect(() => {
        console.log(selectedWarehouseOrigin)
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
        if (!selectedBranchOrigin && !selectedWarehouseOrigin && (movementType === 'TRANSFER' || (adjustmentType === 'OUTCOME'))) {
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

    // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const handleSubmit = async () => {
        // e.preventDefault();

        if (!formRef.current) return;
        setIsLoading(true);

        if (removedProductsTable.length <= 0) {
            toast.error("Debe agregar productos a la transacción.")
            setIsLoading(false);
            return;
        }

        // if (selectDestiny) {
        //     toast.error("Debe agregar el destino de la transacción.")
        //     setIsLoading(false);
        //     return;
        // }

        let hasError = false;
        removedProductsTable.forEach(p => {
            if (!selectDestiny && (movementType === 'INCOME' || movementType === 'TRANSFER' || (movementType === 'ADJUSTMENT' && adjustmentType === 'INCOME'))) {
                toast.error(`Debe seleccionar el destino del producto: ${p.name}`)
                hasError = true;
            }

            if (!selectOrigin && (movementType === 'ADJUSTMENT' && adjustmentType === 'OUTCOME' || movementType === 'TRANSFER')) {
                toast.error(`Debe seleccionar el origen del producto: ${p.name}`)
                hasError = true;
            }
        })

        if (hasError) {
            setIsLoading(false);
            return;
        };


        setIsLoading(false);

        const formData = new FormData(formRef.current);
        const dataArray: any[] = [];
        formData.forEach((value, key) => {
            dataArray.push({ key, value });
        });
        console.log(dataArray)
        // return;
        const { error, message, response } = await createMovement({ token, formData });
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
        router.push('/admin/inventory/movements');

        return;
    }
    return (
        <Form
            ref={formRef}
            validationBehavior='native'
            className="bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded space-y-6"
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
                // isDisabled={(movementType === 'TRANSFER' || adjustmentType === 'OUTCOME') && (selectedBranchOrigin === null && selectedWarehouseOrigin === null) ? true : false}
                ><div className='hidden sm:flex'>Producto</div></Button>
            </div>

            {/* <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'> */}
            <div className='w-full grid grid-cols-1 gap-4'>
                <div className="w-full">
                    {/* <h2 className='font-semibold'>Datos generales</h2> */}

                    <div className="grid grid-cols-1 gap-4">
                        <div className='w-full'>
                            <RadioGroup
                                isRequired
                                name='managerDeliveryType'
                                value={managerDeliveryType}
                                onValueChange={setManagerDeliveryType}
                                classNames={{
                                    label: "text-small"
                                }}
                                size='sm' label="Tipo de transacción" orientation="horizontal">
                                <Radio value="supplier">Proveedor</Radio>
                                {/* <Radio value="OUTCOME">Salida</Radio> */}
                                <Radio value="person">Persona</Radio>
                            </RadioGroup>
                            {
                                managerDeliveryType === 'supplier' ?
                                    <></>
                                    :
                                    <SelectPersonAndCreate token={token} name='selectPerson' personsResponse={personsResponse} />
                            }
                        </div>
                        <div className='w-full'>
                            <RadioGroup
                                isRequired
                                name='movementType'
                                value={movementType}
                                onValueChange={setTransactionType}
                                classNames={{
                                    label: "text-small"
                                }}
                                size='sm' label="Tipo de transacción" orientation="horizontal">
                                <Radio value="INCOME">Entrada</Radio>
                                {/* <Radio value="OUTCOME">Salida</Radio> */}
                                <Radio value="ADJUSTMENT">Ajuste</Radio>
                                <Radio value="TRANSFER">Transferencia</Radio>
                            </RadioGroup>
                        </div>
                        {movementType === 'ADJUSTMENT' && (<div className='w-full'>
                            <RadioGroup
                                isRequired
                                color='success'
                                name='movementAdjustmentType'
                                value={adjustmentType}
                                onValueChange={setAdjustmentType}
                                classNames={{
                                    label: "text-small"
                                }}
                                size='sm' label="Tipo de ajuste" orientation="horizontal">
                                <Radio value="INCOME">Entrada</Radio>
                                <Radio value="OUTCOME">Salida</Radio>
                            </RadioGroup>
                        </div>)}

                        <div className='w-full bg-primary-50 rounded-lg'>
                            <div className='flex justify-between'>
                                <div>
                                    {(movementType === 'TRANSFER' || adjustmentType === 'OUTCOME') && (<Dropdown
                                        size='sm'
                                    >
                                        <DropdownTrigger className="flex">
                                            <Button size='sm' endContent={<ArrowDown01Icon className="text-small" />} variant="flat">
                                                Origen
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disallowEmptySelection
                                            aria-label="Table Columns"
                                            closeOnSelect={false}
                                            selectionMode="single"
                                            selectedKeys={[selectOrigin]}
                                            onSelectionChange={(selection) => setSelectOrigin(selection.currentKey || '')}
                                        >
                                            <DropdownItem key={'branch'} className="capitalize">
                                                Sucursal
                                            </DropdownItem>
                                            <DropdownItem key={'warehouse'} className="capitalize">
                                                Almacén
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>)}
                                </div>
                                <div>
                                    {(movementType === 'TRANSFER' || movementType === 'INCOME' || movementType === 'ADJUSTMENT' && adjustmentType === 'INCOME') && (<Dropdown
                                        size='sm'
                                    >
                                        <DropdownTrigger className="flex">
                                            <Button size='sm' endContent={<ArrowDown01Icon className="text-small" />} variant="flat">
                                                Destino
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disallowEmptySelection
                                            aria-label="Table Columns"
                                            closeOnSelect={false}
                                            selectionMode="single"
                                            selectedKeys={[selectDestiny]}
                                            onSelectionChange={(selection) => setSelectDestiny(selection.currentKey || '')}
                                        >
                                            <DropdownItem key={'branch'} className="capitalize">
                                                Sucursal
                                            </DropdownItem>
                                            <DropdownItem key={'warehouse'} className="capitalize">
                                                Almacén
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>)}
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 mt-1 md:gap-4'>
                                {(movementType === "TRANSFER" || movementType === "OUTCOME" || adjustmentType === 'OUTCOME') && (
                                    <>

                                        {selectOrigin === "warehouse" && (
                                            <div className={movementType === "OUTCOME" || adjustmentType === 'OUTCOME' ? 'col-span-full' : ''}>
                                                <SelectAutocompleteWarehouses
                                                    label="Almacén Origen"
                                                    name="movementWarehouseOriginId"
                                                    isRequired={true}
                                                    warehouses={warehouses}
                                                    selectedWarehouse={selectedWarehouseOrigin}
                                                    setSelectedWarehouse={setSelectedWarehouseOrigin}
                                                />
                                            </div>
                                        )}

                                        {selectOrigin === "branch" && (
                                            <div className={movementType === "OUTCOME" || adjustmentType === 'OUTCOME' ? 'col-span-full' : ''}>
                                                <SelectAutocompleteBranches
                                                    label="Sucursal Origen"
                                                    name="movementBranchOriginId"
                                                    isRequired
                                                    branches={branches}
                                                    selectedBranch={selectedBranchOrigin}
                                                    setSelectedBranch={setSelectedBranchOrigin}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {(movementType === 'TRANSFER' || movementType === 'INCOME' || movementType === 'ADJUSTMENT' && adjustmentType === 'INCOME') && (
                                    <>
                                        {selectDestiny === "warehouse" && (
                                            <div className={movementType === 'INCOME' || adjustmentType === 'INCOME' ? 'col-span-full' : ''}>
                                                <SelectAutocompleteWarehouses
                                                    label="Almacén Destino"
                                                    name="movementDestinationWarehouseId"
                                                    isRequired={true}
                                                    warehouses={warehouses}
                                                    selectedWarehouse={selectedWarehouseDestiny}
                                                    setSelectedWarehouse={setSelectedWarehouseDestiny}
                                                />
                                            </div>
                                        )}

                                        {selectDestiny === "branch" && (
                                            <div className={movementType === 'INCOME' || adjustmentType === 'INCOME' ? 'col-span-full' : ''}>
                                                <SelectAutocompleteBranches
                                                    label="Sucursal Destino"
                                                    name="movementDestinationBranchId"
                                                    isRequired
                                                    branches={branches}
                                                    selectedBranch={selectedBranchDestiny}
                                                    setSelectedBranch={setSelectedBranchDestiny}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                            </div>
                        </div>

                        {(movementType === 'INCOME' || movementType === 'TRANSFER' || adjustmentType === 'INCOME') && (
                            <DatePicker
                                isRequired
                                name="movementDeliveryDate"
                                label="Fecha de ingreso"
                                variant="underlined"
                            />
                        )}

                        <Textarea
                            key={movementType}
                            isRequired={movementType === 'ADJUSTMENT'}
                            name='movementDescription'
                            disableAnimation
                            disableAutosize
                            variant='underlined'
                            label='Descripción'
                            errorMessage={movementType === 'ADJUSTMENT' ? 'La descripción es obligatoria para ajustes de inventario' : ''}
                        />

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
                                        <input type="hidden" name={`unitNameProduct[${product.id}]`} value={product.unit.name} />
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

                    </div>
                </div>

                {/* <div className="w-full">
                    <h2 className='font-semibold'>Seleccionar Productos</h2>
                    <SelectProductTable
                        token={token}
                        productsResponse={productsResponse}
                        onRemoveProduct={handleRemoveProduct} // Ahora recibe la función correcta
                        removedProducts={removedProductsTable} // Enviamos la lista de eliminados
                    />

                </div> */}
            </div>

            <Button
                type='button'
                onPress={handleSubmit}
                color='primary'
                isLoading={isLoading}
                isDisabled={isLoading}
            >
                Guardar Movimiento
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
                                    productsResponse={productsResponse}
                                    onRemoveProduct={handleRemoveProduct} // Ahora recibe la función correcta
                                    removedProducts={removedProductsTable} // Enviamos la lista de eliminados
                                    searchBranchId={selectedBranchOrigin?.id ?? undefined}
                                    searchWarehouseId={selectedWarehouseOrigin?.id ?? undefined}
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
