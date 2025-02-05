"use client"
import { Button, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input, Select, SelectItem } from "@heroui/react";
import { ISimpleCategory } from "@/modules/admin/categories";
import { IBranchProductInventory, IProduct } from "@/modules/admin/products";
import { ISimpleHandlingUnit } from "@/modules/admin/handling-units";
import { FormEvent, useState } from "react";
import { createProduct } from "@/modules/admin/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import no_image from '@/assets/no_image.png'
import { Delete01Icon, PlusMinus01Icon, PlusSignIcon } from "hugeicons-react";
import { IBranch } from "@/modules/admin/branches";

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

    // const branches = [
    //     { id: "branch-1", name: "branch 1" },
    //     { id: "branch-2", name: "branch 2" },
    //     { id: "branch-3", name: "branch 3" },
    //     { id: "branch-4", name: "branch 4" },
    //     { id: "branch-5", name: "branch 5" },
    // ]

    const router = useRouter();

    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [branchProductInventory, setBranchProductInventory] = useState<IBranchProductInventory[]>([])
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

        // Agregar el inventario para la sucursal seleccionada
        setBranchProductInventory((prev) => [
            ...prev,
            {
                branchId,
                stock: "",
                minimumStock: "",
                reorderPoint: "",
                stockLocation: "",
                lastStockUpdate: new Date(),
                purchasePriceOverride: null,
                priceOverride: null
            }
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

            <div className="w-full">
                <h2 className="font-semibold">Datos generales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                    <Input
                        isRequired
                        name="productName"
                        label="Nombre"
                        placeholder="Agrega un nombre a el producto"
                        variant="underlined"
                    />

                    <Input
                        isRequired
                        name="productDescription"
                        label="Descripción"
                        placeholder="Agrega una descripción a el producto"
                        variant="underlined"
                    />

                    <Select
                        isRequired
                        name="productType"
                        label='Tipo de Producto'
                        placeholder="Selecciona el tipo de producto"
                        variant="underlined"
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
                    />

                    <Select
                        isRequired
                        name="productUnitId"
                        label='Unidad de manejo'
                        placeholder="Selecciona la unidad de manejo"
                        variant="underlined"
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
                    />

                    <DatePicker
                        name="productExpirationDate"
                        label="Fecha de expiración"
                        variant="underlined"
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
                    />

                    {/* <Input
                        isRequired
                        name="productMinimunStock"
                        label="Stock mínimo"
                        placeholder="Ingrese el stock mínimo"
                        type="number"
                        variant="underlined"
                    />

                    <Input
                        name="productReorderPoint"
                        label="Stock mínimo para reorden"
                        placeholder="Ingrese el stock mínimo para reordenar"
                        type="number"
                        variant="underlined"
                    /> */}

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
                </div>
            </div>

            {/* Formulario de inventario por sucursal */}
            <div className="w-full">
                <h2 className="font-semibold">Inventario por Sucursal</h2>
                <div className="space-y-4 p-2">
                    {branchProductInventory.map((branchInventory, index) => (
                        <div key={branchInventory.branchId} className="hover:bg-primary-50 rounded-lg p-4">
                            <h3 className="font-semibold">
                                Sucursal: {branches.find(branch => branch.id === branchInventory.branchId)?.name || "Sucursal no encontrada"}
                            </h3>
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
                                />
                                <Input
                                    isRequired
                                    min={1}
                                    name={`inventoryMinimumStock[${branchInventory.branchId}]`}
                                    label="Stock Mínimo"
                                    type="number"
                                    variant="underlined"
                                    value={branchInventory.minimumStock}
                                    onChange={(e) => handleBranchInventoryChange(branchInventory.branchId, 'minimumStock', e.target.value)}
                                />
                                <Input
                                    isRequired
                                    min={1}
                                    name={`inventoryReorderPoint[${branchInventory.branchId}]`}
                                    label="Punto de Reorden"
                                    type="number"
                                    variant="underlined"
                                    value={branchInventory.reorderPoint}
                                    onChange={(e) => handleBranchInventoryChange(branchInventory.branchId, 'reorderPoint', e.target.value)}
                                />
                                <Input
                                    isRequired
                                    name={`inventoryWarehouseId[${branchInventory.branchId}]`}
                                    label="Ubicación del Stock"
                                    variant="underlined"
                                    value={branchInventory.warehouseId || ""}
                                    onChange={(e) => handleBranchInventoryChange(branchInventory.branchId, 'warehouseId', e.target.value)}
                                />
                                <Input
                                    name={`inventoryPurchasePriceOverride[${branchInventory.branchId}]`}
                                    label="Precio de Compra"
                                    type="number"
                                    variant="underlined"
                                    // value={branchInventory.purchasePriceOverride || "0"}
                                    onChange={(e) => handleBranchInventoryChange(branchInventory.branchId, 'purchasePriceOverride', e.target.value)}
                                />
                                <Input
                                    name={`inventoryPriceOverride[${branchInventory.branchId}]`}
                                    label="Precio de Venta"
                                    type="number"
                                    variant="underlined"
                                    // value={branchInventory.priceOverride || "0"}
                                    onChange={(e) => handleBranchInventoryChange(branchInventory.branchId, 'priceOverride', e.target.value)}
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

                    {/* Selección de sucursal para agregar un nuevo formulario */}
                    {/* <Select
                        aria-label="Seleccione una Sucursal"
                        placeholder="Selecciona una Sucursal"
                        label="Sucursal"
                        // onChange={(e) => handleAddBranchForm(e.target.value)}
                        isDisabled={availableBranches.length === 0}
                        variant="underlined"
                        items={availableBranches}
                    >
                        {(item) => (
                            <SelectItem key={item.id} onPress={() => handleAddBranchForm(item.id)}>
                                {item.name}
                            </SelectItem>
                        )}
                    </Select> */}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button color="primary" radius="full" size="sm" isIconOnly variant="ghost" startContent={<PlusSignIcon />} />
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
                    {/* <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        color="primary"
                        className="mt-4"
                        onPress={() => handleAddBranchForm(availableBranches[0]?.id || "")}
                        isDisabled={availableBranches.length === 0}
                        startContent={<PlusSignIcon />}
                    /> */}
                </div>
            </div>

            <div className="w-full">
                <h2 className="font-semibold">Insumos del producto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-4">
                    <Select
                        name="componentIds"
                        label="Insumos para preparación"
                        placeholder="Selecciona si tiene insumos para su preparación"
                        variant="underlined"
                        selectionMode="multiple"
                        onSelectionChange={(selected) => handleSelectionChange(selected as Set<string>)}
                    >
                        {
                            products
                                // .filter(product => product.type === "RawMaterial")
                                .map(product => (
                                    <SelectItem key={product.id}>
                                        {product.name}
                                    </SelectItem>
                                ))
                        }
                    </Select>

                    {/* Renderiza los inputs de cantidad */}
                    {/* <div className="ml-1 mt-1 space-y-4"> */}
                    {selectedProducts.map((product) => (
                        <div key={product.id} className="flex flex-wrap gap-0 mb-1 items-center">
                            {/* <span className="w-full md:w-auto">{products.find((p) => p.id === product.id)?.name}</span> */}
                            <Input
                                name={`quantities[${product.id}]`}
                                label={products.find((p) => p.id === product.id)?.name}
                                type="number"
                                variant="flat"
                                value={product.quantity.toString()}
                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                placeholder="Cantidad"
                                endContent={(products.find(prod => prod.id === product.id))?.unit?.abbreviation || ''}
                                min="1"
                                step="0.01"
                            />
                        </div>
                    ))}
                    {/* </div> */}
                </div>
            </div>

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
                        src={previewImage || no_image}
                        alt='Vista previa'
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className='rounded-lg object-contain'
                    />
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