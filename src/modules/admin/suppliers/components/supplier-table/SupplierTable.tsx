"use client"
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, Popover, PopoverContent, PopoverTrigger, SharedSelection, SortDescriptor, Spinner, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import no_image from '@/assets/no_image.png'
import warning_error_image from '@/assets/warning_error.png'
import { ArrowDown01Icon, Delete01Icon, PencilEdit01Icon, Search01Icon } from 'hugeicons-react';
import { HighlinghtedText } from '@/modules/admin/shared';
import dynamic from 'next/dynamic';
import { DeleteSupplierModal, getSuppliersResponse, ISupplier, ISuppliersResponse, SupplierDetailsModal, UpdateSupplierFormModal } from '@/modules/admin/suppliers';
import { IPersonsResponse } from '@/modules/admin/persons';

// Solo cargar el componente Table dinámicamente
const Table = dynamic(() => import('@heroui/react').then((mod) => mod.Table), { ssr: false });

interface Props {
    editSupplier: boolean;
    editContact: boolean;
    deleteSupplier: boolean;
    token: string;
    itemsResponse: ISuppliersResponse;
    personsResponse: IPersonsResponse;
}

type TImageErrors = {
    [key: string]: boolean;
};

type TSortDescriptor = {
    column: keyof ISupplier; // Esto asegura que 'column' sea una de las claves de ISimpleProduct
    direction: 'ascending' | 'descending';
};

const columns = [
    // { name: "IMAGEN", uid: "image" },
    { name: "NAME", uid: "name", sortable: true },
    { name: "DIRECCIÓN", uid: "address", sortable: true },
    { name: "ESTADO", uid: "status" },
    { name: "CONTACTO PRINCIPAL", uid: "main_contact" },
    { name: "CORREO", uid: "email" },
    { name: "TELÉFONO", uid: "phone" },
    { name: "CREADO", uid: "createdAt", sortable: true },
    { name: "ACTUALIZADO", uid: "updatedAt", sortable: true },
    { name: "ACCIONES", uid: "actions" },
];

const statusOptions = [
    { name: 'Activo', uid: 'active' },
    { name: 'Inactivo', uid: 'inactive' },
];

function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS: string[] = ["name", "address", "status", "main_contact", "phone", "actions"];

export const SupplierTable = ({ deleteSupplier, editSupplier, itemsResponse, token, editContact, personsResponse }: Props) => {
    const isMounted = useRef(false);
    const [itemsFilteredResponse, setItemsFilteredResponse] = useState<ISuppliersResponse>(itemsResponse)
    const [isLoading, setIsLoading] = useState(false);

    // useState filters
    const [searchValue, setSearchValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<SharedSelection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState<SharedSelection>("all")
    const [itemsPerPage, setItemsPerPage] = useState<number>(itemsResponse.suppliers.length);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(itemsResponse.meta.totalPages);

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
            const response = await getSuppliersResponse({
                token: token,
                limit: itemsPerPage,
                page: page,
                search: searchValue,
                status: Array.from(statusFilter).length === statusOptions.length || statusFilter === "all" ? "all" : String(Array.from(statusFilter)[0])
            });

            if (response) {
                setItemsFilteredResponse(response);
                setTotalPages(response.meta.totalPages);
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        fetchUsers();
    }, [itemsPerPage, page, searchValue, itemsResponse, statusFilter]);

    // CONTROL DE LAS IMAGENES QUE TIENE ERROR AL CARGAR
    const [imageErrors, setImageErrors] = useState<TImageErrors>({});
    // Si se actualiza los usuarios que llega de page volvera a iniciar los errores para cargar de nuevo
    useEffect(() => {
        setImageErrors({});
    }, [itemsResponse]);

    // Funcion para identificar las imagenes con error
    const handleImageError = (userId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [userId]: true,
        }))
    };

    // usuarios ordenados de acuerdo al sortItem seleccionado o si cambia usersFiler o status
    const sortedItems = useMemo(() => {
        return [...itemsFilteredResponse.suppliers].sort((a, b) => {
            const first = a[sortDescriptor.column as keyof ISupplier] ?? "";
            const second = b[sortDescriptor.column as keyof ISupplier] ?? "";
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, itemsFilteredResponse, statusFilter]);

    // RENDERIZAR CELDA
    const renderCell = useCallback((item: ISupplier, columnKey: keyof ISupplier) => {
        const primaryContact = item.contactInfo.find((contact) => contact.isPrimary) || item.contactInfo[0]

        switch (columnKey as string) {
            // case "image":
            //     return (
            //         <div className='w-full h-16 flex items-center justify-center'>
            //             <Image
            //                 alt={item.name}
            //                 src={imageErrors[item.id] ? warning_error_image : item.imageUrl || no_image}
            //                 fill
            //                 sizes="(max-width: 768px) 100vw, 50vw"
            //                 className='object-contain'
            //                 priority={item.imageUrl ? false : true}
            //                 onError={() => handleImageError(item.id)} // Se falla la carga, cambia el estado
            //             />
            //         </div>
            //     );
            case "name":
                return (
                    <div>
                        <HighlinghtedText text={item.name} highlight={searchValue} />
                    </div>
                );
            case "email":
                return (
                    <div>
                        {primaryContact?.email || 'N/A'}
                    </div>
                );
            case "address":
                return (
                    <div>
                        <HighlinghtedText text={`${item.city}, ${item.country}`} highlight={searchValue} />
                    </div>
                )
            case "main_contact":
                return (
                    <div>
                        {primaryContact?.contactName || 'N/A'}
                    </div>
                )
            case "phone":
                return (
                    <div>
                        {primaryContact?.phoneNumber || 'N/A'}
                    </div>
                )
            case "status":
                return (
                    <Chip color={item.isActive ? 'success' : 'danger'} size='sm' variant='flat'>
                        {item.isActive ? 'Activo' : 'Inactivo'}
                    </Chip>
                );
            // case "role":
            //     return (
            //         <div>
            //             <div>{item.role.name}</div>
            //             {/* <div className='text-xs text-default-400'>{
            //                 item.role.RolePermission.length > 0 ? item.role.RolePermission.map(roleP =>
            //                     permissionMap[roleP.permission.name as keyof typeof permissionMap]).join(', ')
            //                     :
            //                     '[Sin permisos]'
            //             }
            //             </div> */}
            //         </div>
            //     );
            // case "itemBranches":
            //     return (item.hasGlobalBranchesAccess ?
            //         <div className='text-center'>Acceso Global</div>
            //         :
            //         item.itemBranches.length > 0 ?
            //             <div className='flex justify-center'>
            //                 <Popover placement="left">
            //                     <PopoverTrigger>
            //                         <Button color='primary' variant='light'>{item.itemBranches.length}</Button>
            //                     </PopoverTrigger>
            //                     {item.itemBranches.map(branch => (
            //                         <PopoverContent key={branch.branchId}>
            //                             <div className="px-1 py-2">
            //                                 <div className="text-small font-bold">{branch.branch.name}</div>
            //                                 {/* <div className="text-tiny">This is the popover content</div> */}
            //                             </div>
            //                         </PopoverContent>
            //                     ))}
            //                 </Popover>
            //             </div>
            //             :
            //             <div className='text-default-400 text-center'>N/A</div>
            //     )
            case "createdAt":
                return item.createdAt.toLocaleString();
            case "updatedAt":
                return item.updatedAt.toLocaleString();
            case "actions":
                return (
                    <div className="flex justify-center">
                        <SupplierDetailsModal supplier={item} />
                        {editSupplier && (<UpdateSupplierFormModal token={token} editContact={editContact} supplier={item} personsResponse={personsResponse} />)}
                        {deleteSupplier && (<DeleteSupplierModal supplierId={item.id} token={token} />)}
                    </div>
                )
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
                    <span className="text-default-400 text-small">Total {itemsFilteredResponse.meta.totalItems} usuarios</span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por página:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onItemsPerPageChange}
                            defaultValue={itemsFilteredResponse.meta.itemsPerPage}
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
        itemsFilteredResponse.suppliers.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    // Contenido de la parte inferior de la tabla
    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {`${itemsFilteredResponse.suppliers.length} de ${itemsFilteredResponse.meta.totalItems} usuarios`}
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
    }, [itemsFilteredResponse, page, totalPages, hasSearchFilter]);

    return (
        <section className='container pt-8'>
            <Table
                aria-label='Lista de usuarios'
                selectionMode='single'
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
                            {(columnKey) => <TableCell>{renderCell(items, columnKey as keyof ISupplier)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </section>
    )
}
