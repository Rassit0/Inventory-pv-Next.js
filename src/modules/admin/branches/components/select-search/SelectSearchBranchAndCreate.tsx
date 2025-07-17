"use client"
import { Autocomplete, AutocompleteItem, Button, Chip, Spinner } from '@heroui/react'
import React, { use, useEffect, useMemo, useRef, useState } from 'react'
import { getBranchesResponse, IBranch, IBranchesResponse } from '@/modules/admin/branches'
import { Add01Icon, Search01Icon } from 'hugeicons-react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { CreatePersonFormModal, getPersonsResponse, IPersonsResponse } from '@/modules/admin/persons';
import { useInfiniteScroll } from '@heroui/use-infinite-scroll';
import { CreateSupplierFormModal, createSupplier } from '@/modules/admin/suppliers';

interface Props {
    token: string;
    // filterSuppliersByProductId?: string;
    selectedKeys?: string[];
    itemsResponse: IBranchesResponse;
    branchesIds?: string[]; // IDs de proveedores específicos para filtrar
    excludeSupplierIds?: string[]; // IDs de proveedores a excluir de la lista
    name?: string;
    isRequired?: boolean;
    label?: string
    onSelecteSingledItem?: (item: IBranch | null) => void;
    autoFocus?: boolean;
    create?: {
        createBranch: boolean;
        // createContact: boolean;
        branchesResponse: IBranchesResponse;
    };
    onItemSelectedChange?: (items: IBranch[] | null) => void;
    selectionMode?: 'single' | 'multiple'
    defaultSelectedItemIds?: string[];
}

interface PropsItemList {
    fetchDelay: number
    token: string;
    propsSearch: {
        value: string;
        discardItemsSearch: IBranch[];// Recibe los items ya seleccionados para filtrar y que no aparezcan en los resultados de la busqueda
    };
    orderBy?: 'asc' | 'desc';
    columnOrderBy?: 'name' | 'address' | 'createdAt' | null;
    filterSuppliersByProductId?: string; // ID del producto para filtrar los proveedores
    branchesIds?: string[]; // IDs de proveedores específicos para filtrar
    defaultSelectedItemIds?: string[];
}

function useItemList({ fetchDelay = 0, token, propsSearch, orderBy = 'asc', columnOrderBy = 'name', branchesIds, defaultSelectedItemIds }: PropsItemList) {

    const [items, setItems] = useState<IBranch[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const limit = 10; // Número de items por página, ajustar según sea necesario
    const isFirstRender = useRef(true); // Inicializamos la referencia en true

    /**
     * Función asíncrona para cargar personas desde la API.
     * @param currentPage El número de página actual a cargar.
     * @param token El token de autenticación.
     * @param search Término de búsqueda opcional.
     * @param branchesIds Ids de proveedores que tendrá la lista.
     */
    const loadItems = async ({ currentPage, token, search, branchesIds, defaultSelectedItemIds }: { currentPage: number, token: string, search?: string, branchesIds?: string[], defaultSelectedItemIds?: string[] }) => {
        const controller = new AbortController();
        // Controla para abortar el fetch si el por ej el usuario se va a otra pagina
        const { signal } = controller;

        try {
            setIsLoading(true);

            if (page > 0) {
                // Retraso para simular la latencia de la red
                await new Promise((resolve) => setTimeout(resolve, fetchDelay));
            }

            const res = await getBranchesResponse({ token, orderBy, columnOrderBy, limit, page: currentPage, signal, branchesIds });


            if (!res) {
                throw new Error("Network response was not ok");
            }

            let defaultBranches: IBranch[] = [];

            if (defaultSelectedItemIds && defaultSelectedItemIds.length > 0) {
                // 1. Obtener la primera página
                const response = await getBranchesResponse({
                    branchesIds: defaultSelectedItemIds,
                    token,
                    page: 1
                });
                if (response && response.branches && response.branches.length > 0) {
                    defaultBranches = [...response.branches];

                    const { totalItems, currentPage, totalPages } = response.meta;

                    // 2. Si hay más páginas, preparar las promesas
                    if (totalPages > 1) {
                        const fetchPromises = [];

                        for (let page = currentPage + 1; page <= totalPages; page++) {
                            fetchPromises.push(
                                getBranchesResponse({
                                    branchesIds: defaultSelectedItemIds,
                                    token,
                                    page
                                })
                            );
                        }

                        // 3. Ejecutar todas las peticiones en paralelo
                        const pagesResponses = await Promise.all(fetchPromises);

                        // 4. Extraer las branches y agregarlas
                        for (const res of pagesResponses) {
                            if (res && res.branches && res.branches.length > 0) {
                                defaultBranches = [...defaultBranches, ...res.branches];
                            }
                        }


                    }
                }
            }


            const branches = [
                ...defaultBranches,
                ...(res.branches || [])
            ];


            setPage(res.meta.currentPage);

            setHasMore(res !== null);
            if (page >= res.meta.totalPages) {
                setHasMore(false);
            }
            // Append new results to existing ones
            // setItems((prevItems: any) => [...prevItems, ...res.persons]);
            setItems((prevItems) => {
                // Obtiene los IDs de las personas que ya han sido seleccionadas.
                const currentlyDiscardedIds = propsSearch?.discardItemsSearch?.map(d => d.id) || [];
                // Combina la lista de items anterior con los nuevos items de la API.
                const combined = [...prevItems, ...branches];
                // Elimina los items duplicados basándose en su ID.
                const uniqueCombined = Array.from(new Map(combined.map(item => [item.id, item])).values());
                // Filtra la lista única para excluir las personas que ya están en la lista de descartados.
                const filteredUniqueCombined = uniqueCombined.filter(item => !currentlyDiscardedIds.includes(item.id));
                return filteredUniqueCombined;
            });
        } catch (error: any) {
            if (error.name === "AbortError") {
                console.error("Error al cargar personas:", error);
            } else {
                // eslint-disable-next-line no-console
                console.error("There was an error with the fetch operation:", error);
            }
            setIsLoading(false)
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Evita la carga inicial en la primera renderización
        if (isFirstRender.current) {
            isFirstRender.current = false; // Marcamos que ya no es la primera renderización
            return; // No ejecutar la lógica en la primera renderización
        }

        let newPage = page;
        // Reinicia la página a 1 si el valor de búsqueda está vacío
        if (propsSearch.value === '') {
            newPage = 1;
            setPage(newPage);
            setHasMore(true);
        }
        loadItems({ currentPage: newPage, token, search: propsSearch.value === '' ? undefined : propsSearch.value, branchesIds }) // Agregar filterSuppliersByProductId aquí
        // La dependencia de propsSearch.discardItemsSearch se eliminó aquí para evitar recargas innecesarias
        // }, [propsSearch.value, propsSearch.discardItemsSearch])
    }, [propsSearch.value])


    // useEffect(() => {
    //     loadItems(page, token);
    // }, []);

    /**
     * Función para cargar más personas cuando se alcanza el final del scroll.
     */
    const onLoadMore = () => {
        const newPage = page + 1;

        setPage(newPage);
        loadItems({ currentPage: newPage, token, search: propsSearch.value === '' ? undefined : propsSearch.value, branchesIds, defaultSelectedItemIds });
    };

    return {
        items,
        setItems,
        hasMore, // devuelve un bool para seguir cargando o no al llegar al final del scroll
        isLoading, // Para cuando se cargue
        onLoadMore, // Es la funcion que se ejecuta al llegar al final del scroll
    };
}

/**
 * Componente SelectAutocompletePersons: Un autocomplete personalizado para seleccionar personas.
 */
export const SelectSearchBranchAndCreate = ({ defaultSelectedItemIds, label, itemsResponse, name, isRequired = false, onSelecteSingledItem, token, autoFocus = false, create, onItemSelectedChange, selectionMode = 'single', branchesIds, excludeSupplierIds }: Props) => {

    const firstRender = useRef(true);


    const [searchValue, setSearchValue] = useState('');
    const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc');
    const [columnOrderBy, setColumnOrderBy] = useState<'name' | 'address' | 'createdAt' | null | undefined>('name');

    // estado para el primer intento submit que inicia en false, si se pone en true ya se hizo el primer intento submit
    const [isInvalid, setIsInvalid] = useState(false);
    const [hasAttemptedOnFocus, setHasAttemptedOnFocus] = useState(false);
    const [hasAttemptedOnClick, setHasAttemptedOnClick] = useState(false);
    const [hasAttemptedOnBlur, setHasAttemptedOnBlur] = useState(false);
    const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false); // Nuevo estado para la primera validación

    const [selectedItems, setSelectedItems] = useState<IBranch[]>([]);
    // const [selectSingleItemId, setSelectSingleItemId] = useState<string | null>(null);
    const [selectedKey, setSelectedKey] = useState<string | null>(defaultSelectedItemIds ? defaultSelectedItemIds[0] : null);

    const [isOpen, setIsOpen] = React.useState(false);
    // Utiliza el hook personalizado para la gestión de la lista de personas
    const { items, setItems, hasMore, isLoading, onLoadMore } = useItemList({ fetchDelay: 0, propsSearch: { discardItemsSearch: selectedItems, value: searchValue }, token, orderBy, columnOrderBy, branchesIds, defaultSelectedItemIds });

    useEffect(() => {
        onLoadMore();
    }, [defaultSelectedItemIds, branchesIds]);

    // Configura el scroll infinito utilizando el hook de Hero UI
    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isOpen,
        shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
        onLoadMore,
    });

    // CONTROL DE LAS IMAGENES QUE TIENEN ERROR AL CARGAR
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    useEffect(() => {
        // Limpia los errores de imagen cuando cambia la lista de personas
        setImageErrors({})
    }, [itemsResponse])

    /**
     * Manejador de errores de carga de imágenes.
     * @param itemId El ID del item cuya imagen no se pudo cargar.
     */
    const handleImageError = (itemId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [itemId]: true,
        }));
    };

    /**
     * Función para ordenar la lista de items.
     * @param data La lista de items a ordenar.
     * @returns La lista de items ordenada.
     */
    const sortItems = (data: IBranch[]) => {
        if (!columnOrderBy) return data;

        const sorted = [...data].sort((a, b) => {
            const aValue = a[columnOrderBy as keyof IBranch];
            const bValue = b[columnOrderBy as keyof IBranch];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return orderBy === 'desc'
                    ? bValue.localeCompare(aValue)
                    : aValue.localeCompare(bValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return orderBy === 'desc' ? bValue - aValue : aValue - bValue;
            }

            return 0;
        });

        return sorted;
    };

    /**
     * Función para agregar una item a la lista de seleccionados.
     * @param item El item a seleccionar.
     */
    const addSelectedItem = (item: IBranch | undefined) => {
        if (!item) return;

        // Quitar la itema seleccionada del listado de opciones solo si es modo multiple
        const updateSelectedItems = () => {
            return selectedItems.some(p => p.id === item.id)
                ? selectedItems
                : [...selectedItems, item];
        };
        if (selectionMode === 'multiple') {
            setSelectedItems(updateSelectedItems);

            setItems((prev) => prev.filter(p => p.id !== item.id));

            // si los items rebajan a menos de 6 sumandole el que se acaba de quitar cargara más items
            if (items.length < 7) {
                onLoadMore()
            }

            // Limpia el valor de búsqueda para que no siga filtrando por el ítem recién seleccionado
            setSearchValue(item.name);
            setSearchValue('');

        }
        if (onItemSelectedChange) {
            onItemSelectedChange(updateSelectedItems());
        }
    };

    // Remueve de la seleccion y lo mueve de nuevo a los items de la lista
    /**
    * Función para remover un item de la lista de seleccionados y devolverla a la lista de opciones.
    * @param item El itema a remover.
    */
    const removeSelectedItem = (item: IBranch) => {
        const updateSelectedItems = selectedItems.filter(p => p.id !== item.id);
        setSelectedItems(updateSelectedItems);

        if (onItemSelectedChange) {
            onItemSelectedChange(updateSelectedItems);
        }

        setItems((prev) => {
            const updated = prev.some(p => p.id === item.id)
                ? prev
                : [...prev, item];
            return sortItems(updated);
        });
    };

    // Cargar los items seleccionados por defecto al iniciar el componente
    // Esto se hace una sola vez al montar el componente y si hay IDs por defecto
    useEffect(() => {
        if (items.length > 0 && defaultSelectedItemIds && defaultSelectedItemIds.length > 0 && firstRender.current === true && selectionMode === 'multiple') {
            firstRender.current = false; // Cambia a false después de la primera renderización
            // Si hay IDs por defecto, los agrega a la lista de seleccionados
            items.filter(item => defaultSelectedItemIds.some(id => id === item.id && items.some(i => i.id === id)))
                .forEach(item => addSelectedItem(item));
        }
    }, [items])

    // Filtra los items basados en el valor de búsqueda
    // Utiliza useMemo para evitar cálculos innecesarios en cada renderizado
    const filteredItems = useMemo(() => {
        const searchTerm = searchValue.toLowerCase();
        const searchParts = searchTerm.split(' ').map(part => part.trim()).filter(part => part.length > 0);

        // Crea un Set para búsqueda rápida de IDs seleccionados
        const selectedIds = new Set(selectedItems.map(supplier => supplier.id));
        // Crea un Set para los IDs a excluir si existe excludeSupplierIds
        const excludeIds = excludeSupplierIds ? new Set(excludeSupplierIds) : undefined;


        return sortItems(items.filter(item => {
            // No mostrar si ya está seleccionado
            if (selectedIds.has(item.id) && selectionMode === 'multiple') return false;
            // No mostrar si está en la lista de excluidos
            if (excludeIds && excludeIds.has(item.id)) return false;

            // Búsqueda por nombre y taxId
            const matchesSearchParts = searchParts.every(part =>
                item.name.toLowerCase().includes(part)
            );

            return (
                matchesSearchParts
            );
        })
        );

    }, [items, searchValue, selectedItems, excludeSupplierIds]);

    // useEffect(() => {
    //     if (onItemSelectedChange) {
    //         if (selectedItems.length > 0) {
    //             onItemSelectedChange(selectedItems)
    //         }
    //         // else {
    //         //     onItemSelectedChange(null);
    //         // }
    //     }
    // }, [selectedItems])
    useEffect(() => {
        if (selectionMode === 'single') {
            setSelectedKey(defaultSelectedItemIds ? defaultSelectedItemIds[0] : null);
        }
    }, [defaultSelectedItemIds, selectionMode])


    useEffect(() => {
        // Si solo se valido al intentar hacer submit se pone focus y click en false
        // o si se hizo el primer click no valida, pero al hacer click fuera el componente se valida
        if (hasAttemptedOnBlur || !hasAttemptedValidation && !hasAttemptedOnClick && hasAttemptedOnFocus) {
            setIsInvalid(true);
        }
    }, [hasAttemptedOnBlur, hasAttemptedValidation, hasAttemptedOnClick, hasAttemptedOnFocus])

    return (
        <div className={`w-full flex ${label ? 'items-start' : 'items-center'} justify-center`}>
            {/* Campo oculto para enviar el ID de la sucursal (si es necesario) */}
            {
                selectionMode === 'single' ?
                    <input type='hidden' key={selectedKey} name={name || undefined} value={selectedKey || ''} />
                    :
                    selectedItems.map(item => (
                        <input type='hidden' key={item.id} name={name || undefined} value={item.id} />
                    ))
            }

            <Autocomplete
                onOpenChange={setIsOpen}
                scrollRef={scrollerRef}
                isLoading={isLoading}
                // filtrado de los items ya cargados
                // Filtra los items basados en el valor de búsqueda
                items={filteredItems}
                clearButtonProps={{
                    onPress: () => setSearchValue('')
                }}
                onValueChange={setSearchValue}
                inputValue={selectionMode === 'multiple' ? searchValue : undefined}
                shouldCloseOnBlur={true}
                // name={selectionMode === 'single' ? name : undefined}
                label={label ? <>{label}{!(!isInvalid && isRequired) ? <span className='text-sm text-danger-500'> *</span> : ''}</> : undefined}
                labelPlacement='outside'
                size='sm'
                aria-label="Select an person"
                classNames={selectionMode === 'multiple' ? {
                    base: "max-w-full",
                    listboxWrapper: "max-h-[320px] sm:block",
                    selectorButton: "text-default-500",
                    endContentWrapper: "w-12 h-auto ml-auto",
                    clearButton: "ml-[-15px]",
                } : undefined}
                inputProps={selectionMode === 'multiple' ? {
                    startContent:
                        (selectedItems.length > 0 ?
                            selectedItems.map(person => (
                                <Chip key={person.id} endContent={
                                    <Button
                                        onPress={() => {
                                            if (!isInvalid) {
                                                setIsInvalid(true)
                                            }
                                            removeSelectedItem(person)
                                        }}
                                        isIconOnly
                                        radius="full"
                                        color="primary"
                                        size="sm"
                                        className="w-4 h-4 min-w-0 p-0 m-0 text-[10px]"
                                    >
                                        x
                                    </Button>
                                }>{person.name}</Chip>
                            ))
                            :

                            <Search01Icon className="text-default-400 min-w-5 hidden md:flex" size={20} strokeWidth={2.5} />
                        )
                    ,
                    classNames: {
                        input: "ml-0 flex-1 w-min h-8",
                        inputWrapper: "h-auto ",
                        innerWrapper: "flex flex-wrap gap-1",
                        label: "top-0 mt-4"
                    },
                } : undefined}
                // endContent={create && (
                //     <div className='absolute bottom-0 right-0 left-14'>
                //         <CreatePersonFormModal token={token} onCreate={person => { if (person) addSelectedItem(person) }} />
                //     </div>
                // )}
                listboxProps={{
                    emptyContent: isLoading
                        ? (
                            <div className="flex justify-center items-center py-4">
                                <Spinner size="sm" color="primary" />
                            </div>
                        ) : (
                            <div className="text-center text-default-400 py-4">
                                No hay sucursales disponibles
                            </div>
                        ),
                    hideSelectedIcon: true,
                    itemClasses: {
                        base: [
                            "rounded-medium",
                            "text-default-500",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "dark:data-[hover=true]:bg-default-50",
                            "data-[pressed=true]:opacity-70",
                            "data-[hover=true]:bg-default-200",
                            "data-[selectable=true]:focus:bg-default-100",
                            "data-[focus-visible=true]:ring-default-500",
                        ],
                    },
                }}
                placeholder="Buscar..."
                popoverProps={{
                    offset: 10,
                    // classNames: {
                    //     base: "rounded-large",
                    //     content: "p-1 border-small border-default-100 bg-background",
                    // },
                }}
                radius="md"
                variant="bordered"
                // Muestra la sucursal seleccionada
                // selectedKey={selectionMode === 'multiple' ? '' : undefined}
                selectedKey={selectionMode === 'multiple' ? '' : selectedKey}
                defaultSelectedKey={selectionMode === 'multiple' ? undefined : defaultSelectedItemIds ? defaultSelectedItemIds[0] : undefined}
                // selectedKey={selectionMode === 'single' && defaultSelectedSingleKey ? defaultSelectedSingleKey : undefined}
                onSelectionChange={selectionMode === 'multiple' ? (key) => {
                    const selected = items.find(person => person.id === key);
                    addSelectedItem(selected);
                } : (key) => {
                    // const selected = items.find(person => person.id === key);
                    // setSearchValue(`${selected?.name || ''} ${selected?.lastname || ''} ${selected?.secondLastname || ''}`.trim());
                    // setSelectSingleItemId(key as string || null)
                    setSelectedKey(key as string || null)
                    setSearchValue('')
                    const selected = items.find(item => item.id === key);
                    addSelectedItem(selected);
                    // if (onSelecteSingledItem) onSelecteSingledItem(selected || null)
                }}
                // isInvalid={isInvalid && isRequired && selectedItems.length === 0}
                isInvalid={selectionMode === 'multiple' ? (isRequired && isInvalid && selectedItems.length <= 0 ? true : selectedItems.length > 0 ? false : undefined) : isInvalid && selectedKey === null && isRequired}
                errorMessage={selectionMode === 'multiple' ?
                    "Debes seleccionar al menos un encargado"
                    : "Debes seleccionar un encargado"}

                onBlur={(e) => {
                    if (!hasAttemptedOnBlur) {
                        setHasAttemptedOnBlur(true);
                    }
                    if (!hasAttemptedValidation) {
                        setHasAttemptedValidation(true);
                    }
                    setSearchValue('')
                }}

                onClick={(e) => {
                    if (!hasAttemptedOnClick && hasAttemptedValidation) {
                        setHasAttemptedOnClick(true);
                    }
                    if (!hasAttemptedValidation) {
                        setHasAttemptedValidation(true);
                    }
                }}

                onFocus={(e) => {
                    setTimeout(() => {
                        if (!hasAttemptedOnFocus) {
                            setHasAttemptedOnFocus(true);
                        }
                    }, 100);
                }}

                autoFocus={autoFocus}

                // esta linea es requerida para que valide al hacer submit al formulario
                isRequired={selectionMode === 'multiple' ? (!isInvalid && isRequired) : isRequired}

            >
                {(item) => (
                    <AutocompleteItem key={item.id} textValue={(`${item.name}`)}>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center cursor-pointer">
                                {/* <div className='min-w-10 w-[35px] h-[35px] relative'>
                                    <Image
                                        fill
                                        src={imageErrors[item.id] ? warning_error_image : item.imageUrl || no_image}
                                        alt='Vista previa'
                                        sizes="35px"
                                        className='rounded-full object-contain'
                                        onError={() => handleImageError(item.id)}
                                    />
                                </div> */}
                                <div className="flex-col min-w-0 flex">
                                    <span className="text-small">{item.name}</span>

                                    {/* <span className="text-tiny text-default-400 truncate">CI/NIT: {item.taxId}</span> */}
                                </div>
                            </div>
                            <Button
                                className="border-small mr-0.5 font-medium shadow-small"
                                radius="full"
                                size="sm"
                                variant="bordered"
                                isIconOnly
                                startContent={<Add01Icon />}
                            />
                        </div>
                    </AutocompleteItem>
                )}

            </Autocomplete>

            {/* {create && (<CreatePersonFormModal token={token} onCreate={person => { if (person) addSelectedItem(person) }} />)} */}
            {
                create && create.createBranch && (
                    <div className={label ? 'mt-4' : ''}>
                        {/* <CreateSupplierFormModal
                            token={token}
                            createContact={create.createContact}
                            onCreate={supplier => { if (supplier) removeSelectedItem(supplier) }}
                            personsResponse={create.personsResponse}
                        /> */}
                    </div>
                )
            }
        </div >
    )
}
