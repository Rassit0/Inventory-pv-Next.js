"use client"
import { Key } from '@react-types/shared';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IUser, IUsersResponse } from '@/modules/admin/users'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, Select, SelectItem, SharedSelection, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { getUsersResponse } from '@/modules/admin/users';
import Image from 'next/image';
import no_image from '@/assets/no_image.png'
import warning_error_image from '@/assets/warning_error.png'
import { ArrowDown01Icon, Search01Icon } from 'hugeicons-react';
import { HighlinghtedText } from '@/modules/admin/shared';


interface Props {
    usersResponse: IUsersResponse
}

type TImageErrors = {
    [key: string]: boolean;
};

type TSortDescriptor = {
    column: keyof IUser; // Esto asegura que 'column' sea una de las claves de ISimpleProduct
    direction: 'ascending' | 'descending';
};

const columns = [
    // { name: "IMAGEN", uid: "image" },
    { name: "NAME", uid: "name", sortable: true },
    // { name: "EMAIL", uid: "email", sortable: true },
    { name: "ESTADO", uid: "status" },
    { name: "ROL", uid: "role" },
    // { name: "CREADO", uid: "createdAt", sortable: true },
    // { name: "ACTUALIZADO", uid: "updatedAt", sortable: true },
    // { name: "ACCIONES", uid: "actions" },
];

const statusOptions = [
    { name: 'Activo', uid: 'active' },
    { name: 'Inactivo', uid: 'inactive' },
];

function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS: string[] = ["image", "name", "email", "status", "role", "createdAt", "updatedAt", "actions"];

export const UserAccessWarehouseTable = ({ usersResponse }: Props) => {
    const isMounted = useRef(false);
    const [usersFilteredResponse, setUsersFilteredResponse] = useState<IUsersResponse>(usersResponse)
    const [isLoading, setIsLoading] = useState(false);


    const [selectedKeys, setSelectedKeys] = useState<Selection>();
    // useState filters
    const [searchValue, setSearchValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<SharedSelection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState<SharedSelection>("all")
    const [itemsPerPage, setItemsPerPage] = useState<number>(usersResponse.users.length);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(usersResponse.meta.totalPages);

    // Descripton de clasificacion, para reordenar de acuerdo a la columna
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'name',
        direction: 'ascending'
    })

    // Boolean si existe search busqueda
    const hasSearchFilter = Boolean(searchValue);

    // Mostrar las columnas de la tabla de acuerdo a visibleColumns
    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns])

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

    // ACTUALIZAR LOS USUARIOS SI CAMBIAN LOS FILTROS CON ISMOUNTED PARA QUE MUESTRE LOS INICIALES Q LLEGAN DE PAGE Y SOLO SE ACTUALICE CON FILTROS
    useEffect(() => {
        // Si esta en false no cargará de nuevo los usuarios q llegan de page
        if (!isMounted.current) {
            isMounted.current = true; // Marcar componente como montado
            return;
        }

        const fetchUsers = async () => {
            const response = await getUsersResponse({
                limit: itemsPerPage,
                page: page,
                search: searchValue,
                status: Array.from(statusFilter).length === statusOptions.length || statusFilter === "all" ? "all" : String(Array.from(statusFilter)[0])
            });

            if (response) {
                setUsersFilteredResponse(response);
                setTotalPages(response.meta.totalPages);
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        fetchUsers();
    }, [itemsPerPage, page, searchValue, usersResponse, statusFilter]);

    // CONTROL DE LAS IMAGENES QUE TIENE ERROR AL CARGAR
    const [imageErrors, setImageErrors] = useState<TImageErrors>({});
    // Si se actualiza los usuarios que llega de page volvera a iniciar los errores para cargar de nuevo
    useEffect(() => {
        setImageErrors({});
    }, [usersResponse]);

    // Funcion para identificar las imagenes con error
    const handleImageError = (userId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [userId]: true,
        }))
    };

    // usuarios ordenados de acuerdo al sortItem seleccionado o si cambia usersFiler o status
    const sortedItems = useMemo(() => {
        return [...usersFilteredResponse.users].sort((a, b) => {
            const first = a[sortDescriptor.column as keyof IUser] ?? "";
            const second = b[sortDescriptor.column as keyof IUser] ?? "";
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, usersFilteredResponse, statusFilter]);

    // RENDERIZAR CELDA
    const renderCell = useCallback((user: IUser, columnKey: keyof IUser) => {

        switch (columnKey as string) {
            case "image":
                return (
                    <div className='w-full h-16 flex items-center justify-center'>
                        <Image
                            alt={user.name}
                            src={imageErrors[user.id] ? warning_error_image : user.imageUrl || no_image}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className='object-contain'
                            priority={user.imageUrl ? false : true}
                            onError={() => handleImageError(user.id)} // Se falla la carga, cambia el estado
                        />
                    </div>
                );
            case "name":
                return (
                    <User
                        avatarProps={{
                            radius: 'lg', src: imageErrors[user.id] ? warning_error_image.src : user.imageUrl || no_image.src,
                            onError() {
                                () => handleImageError(user.id)
                            },
                        }}
                        description={user.email}
                        name={<HighlinghtedText text={user.name} highlight={searchValue} />}
                    />
                );
            case "email":
                return (
                    <div>
                        <HighlinghtedText text={user.email} highlight={searchValue} />
                    </div>
                );
            case "status":
                return user.isEnable ? 'Activo' : 'Inactivo';
            case "role":
                return (
                    <Select
                        isRequired
                        name={`userAccess[${user.id}]`}
                        placeholder='Seleccionar...'
                        variant='underlined'
                        selectionMode='single'
                    >
                        <SelectItem key={'ADMIN'} >Administrado</SelectItem>
                        <SelectItem key={'SUPERVISOR'}>Supervisor</SelectItem>
                        <SelectItem key={'OPERATOR'}>Operador</SelectItem>
                        <SelectItem key={'READER'}>Lector</SelectItem>
                    </Select>
                );
            case "createdAt":
                return user.createdAt.toLocaleString();
            case "updatedAt":
                return user.updatedAt.toLocaleString();
            case "actions":
                return 'Actions';
        }
    }, [searchValue]);

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
    const onItemsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
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
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar..."
                        startContent={<Search01Icon />}
                        value={searchValue}
                        onClear={() => onClear()} // Boton para borrar contenido y asignar evento
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ArrowDown01Icon className="text-small" />} variant="flat">
                                    Status
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
                                    Columns
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
                    <span className="text-default-400 text-small">Total {usersFilteredResponse.meta.totalItems} usuarios</span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por página:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onItemsPerPageChange}
                            defaultValue={usersFilteredResponse.meta.itemsPerPage}
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
        visibleColumns,
        onItemsPerPageChange,
        usersFilteredResponse.users.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    // Contenido de la parte inferior de la tabla
    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {`${usersFilteredResponse.users.length} de ${usersFilteredResponse.meta.totalItems} usuarios`}
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
    }, [usersFilteredResponse, page, totalPages, hasSearchFilter]);

    return (
        <section className='container pt-8'>
            <Table
                isHeaderSticky
                aria-label='Lista de usuarios'
                // selectedKeys={['c7cb7dbc-f9ad-4818-968d-d3165518bc8c']}
                // // onSelectionChange={setSelectedKeys}
                selectionMode='multiple'
                bottomContent={bottomContent}
                bottomContentPlacement='outside'
                topContent={topContent}
                topContentPlacement='outside'
                sortDescriptor={sortDescriptor}
                onSortChange={(descriptor) => setSortDescriptor(descriptor)}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'filtering'} emptyContent={"¡Ups! No encontramos nada aquí."} items={sortedItems}>
                    {(items) => (
                        <TableRow key={items.id}>
                            {(columnKey) => <TableCell>{renderCell(items, columnKey as keyof IUser)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </section>
    )
}
