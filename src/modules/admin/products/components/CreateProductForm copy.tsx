"use client"
import { Badge, Button, Checkbox, CheckboxGroup, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input, Select, SelectItem, Switch } from "@heroui/react";
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


interface Props {
    products: IProduct[],
    categories: ISimpleCategory[],
    handlingUnits: ISimpleHandlingUnit[],
    branches: IBranch[]
}

interface SelectedProduct {
    id: string;
    quantity: number;
}

export const CreateProductForm = ({ products, categories, handlingUnits, branches }: Props) => {

    //Form
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productIsEnable, setProductIsEnable] = useState(true);
    const [handlingUnitId, setHandlingUnitId] = useState('');

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

    const handleAddBranchForm = (branchId: string) => {
        // Verificar que la sucursal no esté ya agregada
        const isBranchAlreadyAdded = branchProductStock.some((inventory) => inventory.branchId === branchId);
        if (isBranchAlreadyAdded) return;

        // Agregar el inventario para la sucursal seleccionada
        setBranchProductStock((prev) => [
            ...prev,
            {
                branchId,
                stock: "",
            }
        ]);

        // Eliminar la sucursal seleccionada de la lista de sucursales disponibles
        setAvailableBranches((prev) => prev.filter(branch => branch.id !== branchId));
    };

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
        // Convertir FormData a array (clave, valor)
        const dataArray: any[] = [];
        formData.forEach((value, key) => {
            dataArray.push({ key, value });
        });

        // Convertir el array a JSON y mostrarlo
        // console.log(JSON.stringify(dataArray, null, 2));

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await createProduct(formData);
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

            <div className="grid md:grid-cols-3 w-full">
                <div className="w-full gap-4 p-2 md:col-span-1">
                    <h2 className="font-semibold">Imagen de presentación</h2>
                    <div className='flex flex-col justify-between h-full pb-4'>
                        <ImageUploaderInput name='productImage' />
                        <CheckboxGroup name='productType' defaultValue={["FinalProduct"]}>
                            <Checkbox value="FinalProduct">Producto</Checkbox>
                            <Checkbox value="Supply">Insumo</Checkbox>
                            <Checkbox value="RawMaterial">Materia</Checkbox>
                            {/* <Checkbox value="Recipe">Receta/Servicio/Combo</Checkbox> */}
                        </CheckboxGroup>
                    </div>
                </div>
                <div className="w-full md:col-span-2">
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
                        />

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
                </div>
            </div>

            {/* Formulario de inventario por sucursal */}
            <div className="w-full">
                <h2 className="font-semibold">Stock por Sucursal</h2>
                <div className="space-y-4 p-2">
                    {branchProductStock.map((branchInventory, index) => (
                        <div key={branchInventory.branchId} className="hover:bg-primary-50 rounded-lg p-4">
                            {/* Contenedor de título e indicador */}
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">
                                    Sucursal: {branches.find(branch => branch.id === branchInventory.branchId)?.name || "Sucursal no encontrada"}
                                </h3>
                                {/* Punto verde para indicar que es nuevo */}
                                <span className="min-w-3 h-3 bg-green-500 rounded-full"></span>
                            </div>
                            <input type="hidden" name="branchesIds" value={branchInventory.branchId} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    isRequired
                                    min={1}
                                    name={`inventoryStock[${branchInventory.branchId}]`}
                                    label="Stock"
                                    type="number"
                                    variant="underlined"
                                    value={branchInventory.stock}
                                    onChange={(e) => handleBranchInventoryChange(branchInventory.branchId, 'stock', e.target.value)}
                                    endContent={<div className="text-default-400">{handlingUnits.find(unit => unit.id === handlingUnitId)?.abbreviation}</div>}
                                />
                            </div>

                            <Button
                                isIconOnly
                                radius="full"
                                size="sm"
                                color="danger"
                                onPress={() => handleRemoveBranchForm(branchInventory.branchId)}
                                className="mt-4"
                                startContent={<Delete01Icon />}
                            />
                        </div>
                    ))}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button color="primary" radius="full" size="sm" isIconOnly variant="ghost" startContent={<PlusSignIcon />} isDisabled={!(availableBranches.length > 0)} />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions" items={availableBranches}>
                            {(item) => (
                                <DropdownItem
                                    key={item.id}
                                    onPress={() => handleAddBranchForm(item.id)}
                                >
                                    {item.name}
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
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