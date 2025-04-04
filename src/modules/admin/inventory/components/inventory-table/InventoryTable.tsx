'use client'
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChangeStatusModal, DetailsModal, getMovementsResponse, ITransaction, IMovementsResponse } from '@/modules/admin/inventory';
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, SharedSelection, SortDescriptor, Spinner, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { ArrowDown01Icon, Search01Icon } from 'hugeicons-react';
import dynamic from 'next/dynamic';

// Solo cargar el componente Table dinámicamente
const Table = dynamic(() => import('@heroui/react').then((mod) => mod.Table), { ssr: false });

interface Props {
    token: string;
    editInventory: boolean;
    movementsResponse: IMovementsResponse;
}

type TSortDescriptor = {
    column: 'name' | 'description' | 'createdAt'; // Esto asegura que 'column' sea una de las claves de ISimpleProduct
    direction: 'ascending' | 'descending';
};

const movementTypeMap = {
    'INCOME': 'Entrada',
    'OUTCOME': 'Salida',
    'TRANSFER': 'Transferencia',
    'ADJUSTMENT': 'Ajuste',
};

const columns = [
    { name: "Tipo", uid: "movementType" },
    // { name: "NAME", uid: "name", sortable: true },
    // { name: "EMAIL", uid: "email", sortable: true },
    { name: "ESTADO", uid: "status" },
    // { name: "ROL", uid: "role" },
    // { name: "SUCURSALES", uid: "userBranches" },
    { name: "CREADO", uid: "createdAt", sortable: true },
    { name: "INGRESO", uid: "entryDate", sortable: true },
    // { name: "ACTUALIZADO", uid: "updatedAt", sortable: true },
    { name: "ACCIONES", uid: "actions" },
];

const statusOptions = [
    { name: 'Pendiente', uid: 'PENDING' },
    { name: 'Aceptado', uid: 'ACCEPTED' },
    { name: 'Cancelado', uid: 'CANCELED' },
    { name: 'Completado', uid: 'COMPLETED' },
];

const movementOptions = [
    { name: 'Entradas', uid: 'INCOME' },
    // { name: 'Salidas', uid: 'OUTCOME' },
    { name: 'Ajustes', uid: 'ADJUSTMENT' },
    { name: 'Transferencias', uid: 'TRANSFER' },
];

const statusColorMap: Record<string, "warning" | "success" | "danger" | "primary" | "default" | "secondary"> = {
    'PENDING': 'warning',
    'ACCEPTED': 'success',
    'CANCELED': 'danger',
    'COMPLETED': 'primary',
};

function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS: string[] = [
    "movementType",
    "entryDate",
    "createdAt",
    // "createdByUserId",
    "status",
    // "status",
    "actions",
];

export const InventoryMovementsTable = ({ token, editInventory, movementsResponse }: Props) => {
    const isMounted = useRef(false);
    const [transactionsFilteredResponse, setTransactionsFilteredResponse] = useState<IMovementsResponse>(movementsResponse)
    const [isLoading, setIsLoading] = useState(false);

    // filters table
    const [searchValue, setSearchValue] = useState('');
    const hasSearchFilter = Boolean(searchValue);
    const [visibleColumns, setVisibleColumns] = useState<SharedSelection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState<SharedSelection>("all")
    const [movementFilter, setMovementFilter] = useState<SharedSelection>(new Set(['INCOME']))
    const [itemsPerPage, setItemsPerPage] = useState<number>(movementsResponse.transactions.length);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(movementsResponse.meta.totalPages);
    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns])

    // Descripton de clasificacion, para reordenar de acuerdo a la columna
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'createdAt',
        direction: 'descending'
    })

    // SI SE CAMBIA DE URL SE PONE EN FALSO ISMOUNTED QUE ES PARA QUE NO SE ACTUALICE AL MONTAR EL COMPONENTE Y SOLO AL INGRESAR FILTROS O ACTUALIZAR LOS PRODUCTOS
    const pathname = usePathname();
    useEffect(() => {
        // function para el cambio de ruta y volver isMounted false para q no se vuelva a cargar los usuarios iniciales q llegan al componente
        const handleRouteChange = () => {
            isMounted.current = false;
        }

        return () => {
            handleRouteChange();
        }
    }, [pathname]);

    // ACTUALIZAR LAS TRANSACCIONES SI CAMBIAN LOS FILTROS CON ISMOUNTED PARA QUE MUESTRE LOS INICIALES Q LLEGAN DE PAGE Y SOLO SE ACTUALICE CON FILTROS
    useEffect(() => {
        // Si esta en false no cargará de nuevo los usuarios q llegan de page
        if (!isMounted.current) {
            isMounted.current = true; // Marcar componente como montado
            return;
        }

        // console.log(Array.from(movementFilter))
        const fetchUsers = async () => {
            const response = await getMovementsResponse({
                token: token,
                limit: itemsPerPage,
                page: page,
                status: Array.from(statusFilter).length === statusOptions.length || statusFilter === "all"
                    ? null
                    : (Array.from(statusFilter) as ("PENDING" | "ACCEPTED" | "CANCELED" | "COMPLETED")[]),
                movementType: Array.from(movementFilter).length === movementOptions.length || movementFilter === "all"
                    ? null
                    : (Array.from(movementFilter) as ("INCOME" | "OUTCOME" | "ADJUSTMENT" | "TRANSFER")[]),
                orderBy: sortDescriptor.direction === 'ascending' ? 'asc' : 'desc',
                columnOrderBy: sortDescriptor.column ? sortDescriptor.column as 'createdAt' | 'updatedAt' | null : undefined
            });

            if (response) {
                setTransactionsFilteredResponse(response);
                setTotalPages(response.meta.totalPages);
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        fetchUsers();
    }, [itemsPerPage, page, searchValue, movementsResponse, statusFilter, sortDescriptor, movementFilter]);

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
        setItemsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    // FUNCION PARA FILTRAR POR TEXTO
    const onSearchChange = useCallback((value: string) => {
        if (value) {
            setSearchValue(value);
            setPage(1);
        } else {
            setSearchValue("");
        }
    }, []);

    // FUNCION CUANDO SE BORRA EL CONTENIDO DEL INPUT SEARCH
    const onClear = useCallback(() => {
        setSearchValue("");
        setPage(1);
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    {/* <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar..."
                        startContent={<Search01Icon />}
                        value={searchValue}
                        onClear={() => onClear()} // Boton para borrar contenido y asignar evento
                        onValueChange={onSearchChange}
                    /> */}
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="flex">
                                <Button endContent={<ArrowDown01Icon className="text-small" />} variant="flat">
                                    {movementOptions.find(m => m.uid === movementFilter.currentKey)?.name || "Entradas"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns Type"
                                closeOnSelect={false}
                                selectedKeys={movementFilter}
                                selectionMode="single"
                                onSelectionChange={setMovementFilter}
                            >
                                {movementOptions.map((mOption) => (
                                    <DropdownItem key={mOption.uid} className="capitalize">
                                        {capitalize(mOption.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
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
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
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
                        {/* <Button color="primary" endContent={<PlusMinus01Icon />}>
                  Add New
                </Button> */}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {transactionsFilteredResponse.meta.totalItems} productos</span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por página:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                            defaultValue={transactionsFilteredResponse.transactions.length}
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
        searchValue,
        statusFilter,
        movementFilter,
        visibleColumns,
        onRowsPerPageChange,
        transactionsFilteredResponse.transactions.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {`${transactionsFilteredResponse.transactions.length} de ${transactionsFilteredResponse.meta.totalItems} transacciones`}
                </span>
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
    }, [transactionsFilteredResponse, page, totalPages, hasSearchFilter]);

    // RENDERIZAR CELDA
    const renderCell = useCallback((transaction: ITransaction, columnKey: keyof ITransaction) => {

        switch (columnKey as string) {
            case "entryDate":
                return transaction.entryDate ? transaction.entryDate.toLocaleString() : <div className='text-default-400'>N/A</div>;
            case "createdAt":
                return transaction.createdAt.toLocaleString();
            case "movementType":
                return transaction.movementType !== 'ADJUSTMENT' ? movementTypeMap[transaction.movementType] : movementTypeMap[transaction.movementType]+' de '+movementTypeMap[transaction.adjustmentType!];
            case "status":
                return (
                    <ChangeStatusModal
                        token={token}
                        colorButton={statusColorMap[transaction.status] ?? 'default'}
                        title={statusOptions.find(status => status.uid === transaction.status)?.name || ''}
                        transaction={transaction}
                    />
                )
            case "actions":
                return (
                    <div className="flex justify-center">
                        <DetailsModal transaction={transaction} />
                    </div>
                );

            // default:
            //   return cellValue instanceof Date? cellValue.toLocaleString(): cellValue;
        }
    }, [searchValue])

    return (
        <section className='container pt-8'>
            <Table
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
                        // hideHeader={!editProduct && !deleteProduct && column.uid === 'actions'}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'filtering'} emptyContent={"¡Ups! No encontramos nada aquí."} items={transactionsFilteredResponse.transactions}>
                    {(items) => (
                        <TableRow key={items.id}>
                            {(columnKey) => <TableCell>{renderCell(items, columnKey as keyof ITransaction)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </section>
    )
}
