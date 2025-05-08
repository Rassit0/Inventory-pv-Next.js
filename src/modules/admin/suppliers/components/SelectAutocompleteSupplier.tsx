"use client"
import { Autocomplete, AutocompleteItem, Button, Chip, Spinner } from '@heroui/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IBranch } from '@/modules/admin/branches'
import { Add01Icon, Search01Icon } from 'hugeicons-react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { CreatePersonFormModal, getPersonsResponse, IPerson, IPersonsResponse } from '@/modules/admin/persons';
import { useInfiniteScroll } from '@heroui/use-infinite-scroll';

interface Props {
    token: string;
    personsResponse: IPersonsResponse;
    name?: string;
    isRequired?: boolean;
    label?: string
    selectedBranch?: IBranch | null;
    setSelectedPerson?: (person: IPerson | null) => void;
    autoFocus?: boolean;
}

interface PropsSupplierList {
    fetchDelay: number
    token: string;
    propsSearch: {
        value: string;
        discardItemsSearch: IPerson[];// Recibe los items ya seleccionados para filtrar y que no aparezcan en los resultados de la busqueda
    };
    orderBy?: 'asc' | 'desc';
    columnOrderBy?: "name" | "lastname" | "secondLastname" | "nit" | null | undefined;
}

function useSupplierList({ fetchDelay = 0, token, propsSearch, orderBy = 'asc', columnOrderBy = 'name' }: PropsSupplierList) {

    const [items, setItems] = useState<IPerson[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10; // Número de items por página, ajustar según sea necesario
    const isFirstRender = useRef(true); // Inicializamos la referencia en true

    /**
     * Función asíncrona para cargar personas desde la API.
     * @param currentPage El número de página actual a cargar.
     * @param token El token de autenticación.
     * @param search Término de búsqueda opcional.
     */
    const loadPerson = async (currentPage: number, token: string, search?: string) => {
        const controller = new AbortController();
        // Controla para abortar el fetch si el por ej el usuario se va a otra pagina
        const { signal } = controller;

        try {
            setIsLoading(true);

            if (page > 0) {
                // Retraso para simular la latencia de la red
                await new Promise((resolve) => setTimeout(resolve, fetchDelay));
            }


            const res = await getPersonsResponse({ token, orderBy, columnOrderBy, limit, page: currentPage, signal, search });

            if (!res) {
                throw new Error("Network response was not ok");
            }

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
                const combined = [...prevItems, ...res.persons];
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
        loadPerson(newPage, token, propsSearch.value === '' ? undefined : propsSearch.value)
        // La dependencia de propsSearch.discardItemsSearch se eliminó aquí para evitar recargas innecesarias
        // }, [propsSearch.value, propsSearch.discardItemsSearch])
    }, [propsSearch.value])


    // useEffect(() => {
    //     loadPerson(page, token);
    // }, []);

    /**
     * Función para cargar más personas cuando se alcanza el final del scroll.
     */
    const onLoadMore = () => {
        const newPage = page + 1;

        setPage(newPage);
        loadPerson(newPage, token, propsSearch.value === '' ? undefined : propsSearch.value);
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
export const SelectAutocompletePersons = ({ label, personsResponse, name, isRequired = false, selectedBranch, setSelectedPerson, token, autoFocus = false }: Props) => {

    const [searchValue, setSearchValue] = useState('');
    const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc');
    const [columnOrderBy, setColumnOrderBy] = useState<"name" | "lastname" | "secondLastname" | "nit" | null | undefined>('name');

    // estado para el primer intento submit que inicia en false, si se pone en true ya se hizo el primer intento submit
    const [isInvalid, setIsInvalid] = useState(false);
    const [hasAttemptedOnFocus, setHasAttemptedOnFocus] = useState(false);
    const [hasAttemptedOnClick, setHasAttemptedOnClick] = useState(false);
    const [hasAttemptedOnBlur, setHasAttemptedOnBlur] = useState(false);

    const [selectPersons, setSelectPersons] = useState<IPerson[]>([]);

    const [isOpen, setIsOpen] = React.useState(false);
    // Utiliza el hook personalizado para la gestión de la lista de personas
    const { items, setItems, hasMore, isLoading, onLoadMore } = useSupplierList({ fetchDelay: 1500, propsSearch: { discardItemsSearch: selectPersons, value: searchValue }, token, orderBy, columnOrderBy });

    // Inicializa los items con la respuesta inicial
    useEffect(() => {
        setItems(personsResponse.persons || [])
    }, [])

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
    }, [personsResponse])

    /**
     * Manejador de errores de carga de imágenes.
     * @param personId El ID de la persona cuya imagen no se pudo cargar.
     */
    const handleImageError = (personId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [personId]: true,
        }));
    };

    /**
     * Función para ordenar la lista de personas.
     * @param data La lista de personas a ordenar.
     * @returns La lista de personas ordenada.
     */
    const sortPersons = (data: IPerson[]) => {
        if (!columnOrderBy) return data;

        const sorted = [...data].sort((a, b) => {
            const aValue = a[columnOrderBy];
            const bValue = b[columnOrderBy];

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
     * Función para agregar una persona a la lista de seleccionados.
     * @param person La persona a seleccionar.
     */
    const addSelectedPerson = (person: IPerson | undefined) => {
        if (!person) return;

        // Llama a la función para actualizar la persona seleccionada en el componente padre
        if (setSelectedPerson) setSelectedPerson(person);

        setSelectPersons((prev) => {
            const alreadyExists = prev.some(p => p.id === person.id);
            if (alreadyExists) return prev;
            return [...prev, person];
        });

        // Quitar la persona seleccionada del listado de opciones
        setItems((prev) => prev.filter(p => p.id !== person.id));

        // si los items rebajan a menos de 6 sumandole el que se acaba de quitar cargara más items
        if (items.length < 7) {
            onLoadMore()
        }

        // Limpia el valor de búsqueda para que no siga filtrando por el ítem recién seleccionado
        setSearchValue(person.name);
        setSearchValue('');
    };

    // Remueve de la seleccion y lo mueve de nuevo a los items de la lista
    /**
    * Función para remover una persona de la lista de seleccionados y devolverla a la lista de opciones.
    * @param person La persona a remover.
    */
    const removeSelectedPerson = (person: IPerson) => {
        setSelectPersons((prev) => prev.filter(p => p.id !== person.id));

        setItems((prev) => {
            const updated = prev.some(p => p.id === person.id)
                ? prev
                : [...prev, person];
            return sortPersons(updated);
        });

        // Limpia la selección en el componente padre si se deselecciona la persona actualmente seleccionada
        if (setSelectedPerson) setSelectedPerson(null);
    };


    const filteredItems = useMemo(() => {
        const searchTerm = searchValue.toLowerCase();
        const searchParts = searchTerm.split(' ').map(part => part.trim()).filter(part => part.length > 0);

        return items.filter(item => {
            const fullName = `${item.name} ${item.lastname} ${item.secondLastname || ''}`.toLowerCase().trim();
            const nameLastname = `${item.name} ${item.lastname}`.toLowerCase().trim();

            const matchesSearchParts = searchParts.every(part =>
                [item.name, item.lastname, item.secondLastname || ''].some(field => field.toLowerCase().includes(part))
            );

            return (
                matchesSearchParts ||
                item.nit.toLowerCase().includes(searchTerm) ||
                fullName.includes(searchTerm) ||
                nameLastname.includes(searchTerm)
            ) && !selectPersons.some(person => person.id === item.id);
        });
    }, [items, searchValue, selectPersons]);

    return (
        <div className='w-full flex items-start justify-center'>
            {/* Campo oculto para enviar el ID de la sucursal (si es necesario) */}
            {
                selectPersons.map(person => (
                    <input type='hidden' key={person.id} name={name || `select-person-${person.id}`} value={person.id} />
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
                inputValue={searchValue}
                shouldCloseOnBlur={false}
                // name={name}
                // isRequired={isRequired}
                // simula que esta en requiredcuando ya se intento el primer submit y se validó para mostrar 
                // el * de requerido y quitar la validacion de required porque esto solo es un input que no 
                // necesita esa validación, solo valida la cantidad de items seleccionados.
                label={label ? <>{label}{!(!isInvalid && isRequired) ? <span className='text-sm text-danger-500'> *</span> : ''}</> : undefined}
                labelPlacement='outside'
                size='sm'
                aria-label="Select an person"
                classNames={{
                    base: "max-w-full",
                    listboxWrapper: "max-h-[320px] sm:block",
                    selectorButton: "text-default-500",
                    endContentWrapper: "w-12 h-auto ml-auto",
                    clearButton: "ml-[-15px]",
                }}
                inputProps={{
                    startContent:
                        (selectPersons.length > 0 ?
                            selectPersons.map(person => (
                                <Chip key={person.id} endContent={
                                    <Button
                                        onPress={() => {
                                            if (!isInvalid) {
                                                setIsInvalid(true)
                                            }
                                            removeSelectedPerson(person)
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

                            <Search01Icon className="text-default-400 min-w-5" size={20} strokeWidth={2.5} />
                        )
                    ,
                    classNames: {
                        input: "ml-0 flex-1 w-min",
                        inputWrapper: "h-auto ",
                        innerWrapper: "flex flex-wrap gap-1",
                        label: "top-0 mt-4"
                    },
                }}
                listboxProps={{
                    emptyContent: isLoading
                        ? (
                            <div className="flex justify-center items-center py-4">
                                <Spinner size="sm" color="primary" />
                            </div>
                        ) : (
                            <div className="text-center text-default-400 py-4">
                                No hay encargados disponibles
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
                selectedKey={''} // Muestra la sucursal seleccionada
                onSelectionChange={(key) => {
                    const selected = items.find(person => person.id === key);
                    addSelectedPerson(selected);
                }}
                isInvalid={isInvalid && isRequired && selectPersons.length === 0}
                errorMessage={"Debes seleccionar al menos un encargado"}

                onBlur={(e) => {
                    setIsInvalid(true);
                }}

                onFocus={(e) => {
                    if (autoFocus)
                        return;
                    setIsInvalid(true);
                }}

                autoFocus={autoFocus}

                // esta linea es requerida para que valide al hacer submit al formulario
                isRequired={!isInvalid && isRequired}
            >
                {(item) => (
                    <AutocompleteItem key={item.id} textValue={item.name}>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center cursor-pointer">
                                <div className='min-w-10 w-[35px] h-[35px] relative'>
                                    <Image
                                        fill
                                        src={imageErrors[item.id] ? warning_error_image : item.imageUrl || no_image}
                                        alt='Vista previa'
                                        sizes="35px"
                                        className='rounded-full object-contain'
                                        onError={() => handleImageError(item.id)}
                                    />
                                </div>
                                <div className="flex-col min-w-0 flex">
                                    <span className="text-small">{item.name} {item.lastname}{item.secondLastname ? ` ${item.secondLastname}` : ''}</span>

                                    <span className="text-tiny text-default-400 truncate">CI/NIT: {item.nit}</span>
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
            <CreatePersonFormModal token={token} onCreate={person => { if (person) addSelectedPerson(person) }} />
        </div>
    )
}
