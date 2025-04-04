"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DeleteWarehouseModal, getWarehousesResponse, IWarehousesResponse, UpdateWarehouseFormModal } from '@/modules/admin/warehouses'
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, SharedSelection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png'
import { IUsersResponse } from '@/modules/admin/users';
import { IBranch } from '@/modules/admin/branches';
import { ArrowDown01Icon, Delete01Icon } from 'hugeicons-react';

interface Props {
    editWarehouse: boolean;
    deleteWarehouse: boolean;
    token: string;
    warehousesResponse: IWarehousesResponse;
    usersResponse: IUsersResponse;
    branches: IBranch[];
}


type ImageErrors = {
    [key: string]: boolean;
}
const statusOptions = [
    { name: "Activo", uid: "active" },
    { name: "Inactivo", uid: "inactive" },
];

export const WarehouseTable = ({ deleteWarehouse, editWarehouse, token, warehousesResponse, branches, usersResponse }: Props) => {
    console.log(warehousesResponse)

    const [imageErrors, setImageErrors] = useState<ImageErrors>({});
    const [warehousesResponseFiltered, setWarehousesResponseFiltered] = useState(warehousesResponse)
    const [isLoading, setIsLoading] = useState(false);


    const isMounted = useRef(false);
    // USESTATE UI DE FILTROS
    const [filterValue, setFilterValue] = useState('');
    // const [visibleColumns, setVisibleColumns] = useState<SharedSelection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState<SharedSelection>("all");
    const [rowsPerPage, setRowsPerPage] = useState(warehousesResponse.warehouses.length);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(warehousesResponse.meta.totalPages);


    useEffect(() => {
        // Si esta en false no cargará de nuevo los productos
        if (!isMounted.current) {
            isMounted.current = true; // Marcar como montado
            return; // Saltar la ejecución inicial
        }

        const fetchProducts = async () => {
            const response = await getWarehousesResponse({
                token,
                limit: rowsPerPage,
                page: page,
                search: filterValue,
                status: Array.from(statusFilter).length === statusOptions.length || statusFilter === "all" ? "all" : String(Array.from(statusFilter)[0])
            });
            // console.log(response)
            setWarehousesResponseFiltered(response!);
            setTotalPages(response!.meta.totalPages);
            setIsLoading(false);
        }
        setIsLoading(true);
        fetchProducts(); // Llama a la funcion que llama a los productos con filtros(params)
    }, [rowsPerPage, page, filterValue, warehousesResponse, statusFilter]);

    const handleImageError = (warehouseId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [warehouseId]: true,
        }));
    };

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    {/* <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar..."
                        startContent={<Search01Icon />}
                        value={filterValue}
                        onClear={() => onClear()} // Boton para borrar contenido y asignar evento
                        onValueChange={onSearchChange}
                    /> */}
                    <div></div>
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ArrowDown01Icon className="text-small" />} variant="flat">
                                    Estado
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        {/* <Dropdown>
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
                        </Dropdown> */}
                        {/* <Button color="primary" endContent={<PlusMinus01Icon />}>
                  Add New
                </Button> */}
                    </div>
                </div>
                {/* <div className="flex justify-between items-center">
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
                </div> */}
            </div>
        );
    }, [
        // filterValue,
        statusFilter,
        // visibleColumns,
        // onRowsPerPageChange,
        // productsFilteredResponse.products.length,
        // onSearchChange,
        // hasSearchFilter,
    ]);

    return (
        <section className='container pt-8'>
            <Table
                aria-label='Lista de almacenes'
                selectionMode='single'
                topContent={topContent}
            >
                <TableHeader>
                    <TableColumn>IMAGEN</TableColumn>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>UBICACIÓN</TableColumn>
                    <TableColumn>SUCURSAL</TableColumn>
                    <TableColumn>ESTADO</TableColumn>
                    <TableColumn hideHeader={!deleteWarehouse && !editWarehouse}>ACCIONES</TableColumn>
                </TableHeader>

                <TableBody emptyContent={"¡Ups! No encontramos nada aquí."}>
                    {warehousesResponseFiltered.warehouses.map(warehouse => (
                        <TableRow key={warehouse.id}>
                            <TableCell>
                                <div className='w-full h-16 flex items-center justify-center'>
                                    <Image
                                        alt={warehouse.name}
                                        src={imageErrors[warehouse.id] ? warning_error_image : warehouse.imageUrl || no_image}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className='object-contain'
                                        priority={warehouse.imageUrl ? false : true}
                                        onError={() => handleImageError(warehouse.id)}
                                    />
                                </div>
                            </TableCell>
                            <TableCell>{warehouse.name}</TableCell>
                            <TableCell>{warehouse.location}</TableCell>
                            <TableCell>{warehouse.branches.filter(branch => branch.details?.name).map(branch => branch.details?.name).join(', ') || 'N/A'}</TableCell>
                            <TableCell>
                                <Chip color={warehouse.isEnable ? 'success' : 'danger'} size='sm' variant='flat'>
                                    {warehouse.isEnable ? 'Activo' : 'Inactivo'}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className='flex'>
                                    {editWarehouse && (<UpdateWarehouseFormModal warehouse={warehouse} usersResponse={usersResponse} branches={branches} token={token} />)}
                                    {deleteWarehouse && (<DeleteWarehouseModal token={token} warehouseId={warehouse.id} />)}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    )
}
