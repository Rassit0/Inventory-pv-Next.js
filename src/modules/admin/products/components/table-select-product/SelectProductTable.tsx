"use client"
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, SharedSelection, Spinner, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DetailsStockModal, getProducts, IProduct, IProductsResponse } from '@/modules/admin/products'
import Image from 'next/image'
import no_image from '@/assets/no_image.png'
import warning_error_image from '@/assets/warning_error.png'
import { Add01Icon, ArrowDown01Icon, Search01Icon } from 'hugeicons-react'
import { HighlinghtedText } from '@/modules/admin/shared'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { IRecipeItemProduct } from '@/modules/admin/production-recipes'

// Solo cargar el componente Table dinámicamente
const Table = dynamic(() => import('@heroui/react').then((mod) => mod.Table), { ssr: false });

interface Props {
    token: string;
    productsResponse: IProductsResponse;
    onRemoveProduct: (product: IProduct) => void;
    removedProducts: IProduct[]; // Recibimos los eliminados
    // removedProducts: IRecipeItemProduct[]
    filterByLocationId?: string;
    // searchBranchId?: string;
    // searchWarehouseId?: string;
    defaultProductsIds?: string[];
}

const columns = [
    { name: "", uid: "addButton" },
    { name: "IMAGEN", uid: "image" },
    { name: "NOMBRE", uid: "name", sortable: true },
    { name: "DESCRIPCIÓN", uid: "description", sortable: true },
    { name: "PRECIO", uid: "price" },
    { name: "FECHA DE CRECIÓN", uid: "createdAt", sortable: true },
    { name: "ESTADO", uid: "status" },
    { name: "ACCIONES", uid: "actions" },
];
const statusOptions = [
    { name: "Activo", uid: "active" },
    { name: "Inactivo", uid: "inactive" },
];

function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

type TImageErrors = {
    [key: string]: boolean; // Claves como strings (IDs) y valores booleanos
};

type TSortDescriptor = {
    column: 'name' | 'description' | 'createdAt'; // Esto asegura que 'column' sea una de las claves de ISimpleProduct
    direction: 'ascending' | 'descending';
};

const INITIAL_VISIBLE_COLUMNS: string[] = ["addButton", "image", "name", "actions"];

export const SelectProductTable = ({ token, productsResponse, onRemoveProduct, removedProducts, filterByLocationId, defaultProductsIds }: Props) => {
    const isMounted = useRef(false);
    const [productsFilteredResponse, setProductsFilteredresponse] = useState<IProductsResponse>(() => {
        // console.log(response)
        const filteredProducts = productsResponse.products.filter(
            (p) => !removedProducts.some((removed) => removed.id === p.id)
        );
        return { ...productsResponse!, products: filteredProducts };
    });
    const [isLoading, setIsLoading] = useState(false);

    // USESTATE UI DE FILTROS
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<SharedSelection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState<SharedSelection>("all");
    const [rowsPerPage, setRowsPerPage] = useState(productsResponse.products.length);

    // Descriptor de clasificacion
    const [sortDescriptor, setSortDescriptor] = useState<TSortDescriptor>({
        column: "name",
        direction: "ascending",
    });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(productsResponse.meta.totalPages);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns])

    // Remover producto
    // Manejar la eliminación de un producto
    // const [removedProducts, setRemovedProducts] = useState<IProduct[]>([]);
    const removeProduct = (product: IProduct) => {
        setProductsFilteredresponse((prev) => ({
            ...prev,
            products: prev.products.filter((p) => p.id !== product.id),
        }));

        // setRemovedProducts((prev) => [...prev, product]); // Agrega a la lista de eliminados
        onRemoveProduct(product); // Notifica al padre con la nueva lista
    };

    // SI SE CAMBIA DE URL SE PONE EN FALSO ISMOUNTED QUE ES PARA QUE NO SE ACTUALICE AL MONTAR EL COMPONENTE Y SOLO AL INGRESAR FILTROS O ACTUALIZAR LOS PRODUCTOS
    const pathname = usePathname();
    useEffect(() => {
        // funcion para el cambio de ruta y volver isMounteda false para que no se vuelva a cargar los productos iniciales que llegan al componente
        const handleRouteChange = () => {
            isMounted.current = false;
        }

        return () => {
            handleRouteChange();
        }
    }, [pathname])

    // FUNCION PARA ACTUALIZAR LOS PRODUCTOS CON FILTROS O SI SE ACTUALIZA UN PRODUCTO
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await getProducts({
                token,
                limit: rowsPerPage,
                page: page,
                search: filterValue,
                status: 'active',
                orderBy: sortDescriptor.direction === 'ascending' ? 'asc' : 'desc',
                columnOrderBy: sortDescriptor.column ? sortDescriptor.column : undefined,
                filterByLocationId: filterByLocationId,
                // searchBranchId: searchBranchId,
                // searchWarehouseId: searchWarehouseId
            });
            // console.log(response)
            const filteredProducts = response!.products.filter(
                (p) => !removedProducts.some((removed) => removed.id === p.id)
            );
            setProductsFilteredresponse({ ...response!, products: filteredProducts });
            setTotalPages(response!.meta.totalPages);
            setIsLoading(false);
        }
        setIsLoading(true);
        fetchProducts(); // Llama a la funcion que llama a los productos con filtros(params)
    }, [rowsPerPage, page, filterValue, productsResponse, statusFilter, sortDescriptor, removedProducts, filterByLocationId]);

    // CONTROL DE LAS IMAGENES QUE TIENEN ERROR AL CARGAR
    const [imageErrors, setImageErrors] = useState<TImageErrors>({});
    useEffect(() => {
        setImageErrors({})
    }, [productsResponse])

    const handleImageError = (productId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [productId]: true,
        }));
    };

    // RENDERIZAR CELDA
    const renderCell = useCallback((product: IProduct, columnKey: keyof IProduct) => {

        switch (columnKey as string) {
            case 'addButton':
                return (
                    <Button
                        onPress={() => removeProduct(product)}
                        isIconOnly
                        startContent={<Add01Icon />}
                        color='primary'
                        radius='full'
                        size='sm'
                        variant='light'
                    />
                )
            case "image":
                return (
                    <div className='w-full h-16 flex items-center justify-center'>
                        <Image
                            alt={product.name}
                            src={imageErrors[product.id] ? warning_error_image : product.imageUrl || no_image}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className='object-contain'
                            priority={product.imageUrl ? false : true}
                            onError={() => handleImageError(product.id)} // Se falla la carga, cambia el estado
                        />
                    </div>
                );
            case "name":
                return (
                    <div>
                        <HighlinghtedText text={product.name} highlight={filterValue} />
                    </div>
                );
            case "description":
                return (
                    <div>
                        <HighlinghtedText text={product.description} highlight={filterValue} />
                    </div>
                );
            // case "price":
            //     return `${product.price} Bs.`;
            case "createdAt":
                return product.createdAt.toLocaleString();
            case "status":
                return (
                    <Chip color={product.isEnable ? 'success' : 'danger'} size='sm' variant='flat'>
                        {product.isEnable ? 'Activo' : 'Inactivo'}
                    </Chip>
                )
            case "actions":
                return (
                    <div className="flex justify-center">
                        <DetailsStockModal product={product} />
                    </div>
                );

            // default:
            //   return cellValue instanceof Date? cellValue.toLocaleString(): cellValue;
        }
    }, [filterValue])

    // CAMBIAR EL VALOR DE LA PAGINACIÓN
    const onNextPage = useCallback(() => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }, [page, totalPages]);
    const onPreviousPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page])

    // FUNCION PARA MOSTRAR LA CANTIDAD DE PRODUCTOS
    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    // FUNCION PARA FILTRAR POR TEXTO
    const onSearchChange = useCallback((value: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    // FUNCION CUANDO SE BORRA EL CONTENIDO DEL INPUT SEARCH
    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar..."
                        startContent={<Search01Icon />}
                        value={filterValue}
                        onClear={() => onClear()} // Boton para borrar contenido y asignar evento
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ArrowDown01Icon className="text-small" />} variant="flat">
                                    Columnas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {productsFilteredResponse.meta.totalItems} productos</span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por página:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                            defaultValue={productsFilteredResponse.products.length}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        productsFilteredResponse.products.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-center">
                {/* <span className="w-[30%] text-small text-default-400">
                    {`${productsFilteredResponse.products.length} de ${productsFilteredResponse.meta.totalItems - removeProduct.length} productos`}
                </span> */}
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={totalPages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Anterior
                    </Button>
                    <Button isDisabled={totalPages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Siguiente
                    </Button>
                </div>
            </div>
        );
    }, [productsFilteredResponse, page, totalPages, hasSearchFilter, removeProduct]);

    return (
        <Table
            className='w-full'
            aria-label='Lista de productos'
            selectionMode='single'
            bottomContent={bottomContent}
            bottomContentPlacement='outside'
            topContent={topContent}
            topContentPlacement='outside'
            sortDescriptor={sortDescriptor}
            onSortChange={(descriptor) => setSortDescriptor(descriptor as TSortDescriptor)}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    //   hideHeader={!editProduct && !deleteProduct && column.uid === 'actions'}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>

            <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'filtering'} emptyContent={"¡Ups! No encontramos nada en esta página."} items={isLoading ? [] : productsFilteredResponse.products}>
                {(items) => (
                    <TableRow key={items.id}>
                        {(columnKey) => <TableCell>{renderCell(items, columnKey as keyof IProduct)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
