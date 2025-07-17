"use client"
import { Autocomplete, AutocompleteItem, Badge, Button, Checkbox, CheckboxGroup, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input, Select, SelectItem, Switch, Textarea } from "@heroui/react";
import { ISimpleCategory } from "@/modules/admin/categories";
import { IBranchProductStock, IProduct } from "@/modules/admin/products";
import { ISimpleHandlingUnit } from "@/modules/admin/handling-units";
import { FormEvent, useState } from "react";
import { createProduct } from "@/modules/admin/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import no_image from '@/assets/no_image.png'
import { Delete01Icon, PlusMinus01Icon, PlusSignIcon } from "hugeicons-react";
import { IBranch } from "@/modules/admin/branches";
import { ImageUploaderInput } from "@/modules/admin/shared";
import { useSessionStore } from "@/modules/auth";
import { ISupplier, ISuppliersResponse, SelectSearchSupplierAndCreate } from "@/modules/admin/suppliers";
import { IPersonsResponse, SelectMultipleSearchPersonsAndCreate } from "@/modules/admin/persons";


interface Props {
    token: string;
    products: IProduct[];
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

export const CreateProductForm = ({ token, categories, handlingUnits, branches, supplierProps }: Props) => {

    //Form
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productIsEnable, setProductIsEnable] = useState(true);
    const [handlingUnitId, setHandlingUnitId] = useState('');
    const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>([])

    const router = useRouter();

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [branchProductStock, setBranchProductStock] = useState<IBranchProductStock[]>([])
    const [availableBranches, setAvailableBranches] = useState<IBranch[]>(branches); // Sucursales disponibles

    const [isLoading, setIsLoading] = useState(false);

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

    //     // Agregar el inventario para la sucursal seleccionada
    //     setBranchProductStock((prev) => [
    //         ...prev,
    //         {
    //             branchId,
    //             stock: "",
    //         }
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
        // Agregar las categorías seleccionadas manualmente
        selectedCategoriesIds.forEach(categoryId => {
            formData.append("categoryIds", categoryId);
        });
        // Convertir FormData a array (clave, valor)
        const dataArray: any[] = [];
        formData.forEach((value, key) => {
            dataArray.push({ key, value });
        });

        // Convertir el array a JSON y mostrarlo
        // console.log(JSON.stringify(dataArray, null, 2));

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await createProduct({ formData, token: token || '' });
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

        // Si se guarda con éxito
        toast.success(message);
        setIsLoading(false);

        router.push('/admin/products');

        return;
    }

    return (
        <Form
            validationBehavior="native"
            className="bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded space-y-6"
            onSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-semibold">Formulario</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 w-full">
                <div className="w-full gap-4 p-2 md:col-span-1">
                    <h2 className="font-semibold">Imagen de presentación</h2>
                    <div className='flex flex-col justify-between h-full pb-4'>
                        <ImageUploaderInput name='productImage' />
                    </div>
                </div>
                <div className="w-full md:col-span-2">
                    <h2 className="font-semibold">Datos generales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 w-full">
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
                        >
                            {
                                categories.map(category => (
                                    <SelectItem key={category.id}>{category.name}</SelectItem>
                                ))
                            }
                        </Select>

                        {/* <Autocomplete
                            isRequired
                            className="max-w-xs"
                            defaultItems={categories}
                            label="Categoría(s)"
                            placeholder="Seleccione la categoría(s)"
                            variant="underlined"
                            multiple
                            onSelectionChange={(keys) => console.log(keys)}
                        >
                            {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                        </Autocomplete> */}


                        {/* <Input
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
                        /> */}

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

                        {/* <Select
                            // isRequired
                            name="supplierIds"
                            label="Proveedor(s)"
                            placeholder="Seleccione el proveedor(s) del producto"
                            variant="underlined"
                            selectionMode="multiple"
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
                        />

                        <Input
                            isRequired
                            min={1}
                            name='reorderPointProduct'
                            label="Punto de reorden"
                            type="number"
                            variant="underlined"
                            endContent={<div className="text-default-400">{handlingUnits.find(unit => unit.id === handlingUnitId)?.abbreviation}</div>}
                        />

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
                        <div className="md:col-span-3">
                            <Textarea
                                // key={productDescription}
                                // disableAnimation
                                // disableAutosize
                                name="productDescription"
                                classNames={{
                                    // base: "max-w-xs",
                                    input: "resize-y min-h-[20px]",
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
                        </div>
                        <div className="md:col-span-3">
                            <SelectSearchSupplierAndCreate
                                // isRequired
                                token={token}
                                name={`productSuppliersIds`}
                                itemsResponse={supplierProps.suppliersResponse}
                                // selectedSingleKey={entry.supplierId ?? ''}
                                // onSelecteSingledItem={(value) => value && handleSupplierChange(item.id, index, value.id)}
                                // defaultSelectedItemIds={product.suppliers.map(supplier => supplier.supplierId)}
                                create={supplierProps.create}
                                selectionMode='multiple'
                            />
                        </div>
                        {/* <DatePicker
                            name="productLaunchDate"
                            label="Fecha de ingreso"
                            variant="underlined"
                        />

                        <DatePicker
                            name="productExpirationDate"
                            label="Fecha de expiración"
                            variant="underlined"
                        /> */}

                        <input type="hidden" name="productIsEnable" value={productIsEnable ? 'true' : 'false'} />
                        <div className="p-2">
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
                    <CheckboxGroup className="p-4" orientation="horizontal" name='productType' defaultValue={["FinalProduct"]}>
                        <Checkbox value="FinalProduct">Producto</Checkbox>
                        <Checkbox value="Supply">Insumo</Checkbox>
                        {/* <Checkbox value="RawMaterial">Materia</Checkbox> */}
                        {/* <Checkbox value="Recipe">Receta/Servicio/Combo</Checkbox> */}
                    </CheckboxGroup>
                </div>
            </div>

            <Button
                type='submit'
                color='primary'
                className='block'
                isLoading={isLoading}
                isDisabled={isLoading}
            >
                Guardar Producto
            </Button>
        </Form>
    )
}