"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Popover, PopoverContent, PopoverTrigger, SharedSelection, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react'
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DeleteProductModal, getProducts, IProductsResponse, ISimpleProduct, UpdateProductFormModal } from '@/modules/admin/products'
import Image from 'next/image'
import no_image from '@/assets/no_image.png'
import warning_error_image from '@/assets/warning_error.png'
import { ISimpleCategory } from '@/modules/admin/categories'
import { ISimpleHandlingUnit } from '@/modules/admin/handling-units'
import { ArrowDown01Icon, PlusMinus01Icon, Search01Icon, ViewIcon } from 'hugeicons-react'
import { HighlinghtedText } from '@/modules/admin/shared'
import { usePathname } from 'next/navigation'


interface Props {
  productsResponse: IProductsResponse;
}

const columns = [
  { name: "IMAGEN", uid: "image", sortable: true },
  { name: "NOMBRE", uid: "name", sortable: true },
  { name: "DESCRIPCIÓN", uid: "description", sortable: true },
  { name: "PRECIO", uid: "price" },
  { name: "FECHA DE CRECIÓN", uid: "createdAt", sortable: true },
  { name: "ESTADO", uid: "status" },
  { name: "CATEGORIES", uid: "categories" },
];
const statusOptions = [
  { name: "Activo", uid: "active" },
  { name: "Inactivo", uid: "inactive" },
];

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

type ImageErrors = {
  [key: string]: boolean; // Claves como strings (IDs) y valores booleanos
};

type Key = string | number;

type TSortDescriptor = {
  column: keyof ISimpleProduct; // Esto asegura que 'column' sea una de las claves de ISimpleProduct
  direction: 'ascending' | 'descending';
};

const INITIAL_VISIBLE_COLUMNS: string[] = ["image", "name", "description", "price", "status", "categories"];

export const ReportProductTable = ({ productsResponse }: Props) => {

  const [selectedRowKeys, setSelectedRowKeys] = useState<"all" | Iterable<Key> | undefined>(new Set());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalTitle, setModalTitle] = useState('');
  useEffect(() => {
    // Asegurarse de que selectedKeys no sea undefined o vacío
    if (selectedRowKeys instanceof Set && selectedRowKeys.size > 0) {
      // Convertir el Set en un Array
      const selectedKeyArray = Array.from(selectedRowKeys);

      // Acceder al primer valor del Array y convertirlo a un string
      const selectedKey = selectedKeyArray[0].toString();

      // Filtrar los datos usando el selectedKey convertido a string
      const filteredData = productsFilteredResponse.products.filter(
        (product) => product.id === selectedKey
      );

      setModalTitle(filteredData[0].name)
      // setProducts(filteredData[0].products);
      onOpen();
    }
  }, [selectedRowKeys, productsResponse])

  const isMounted = useRef(false);
  const [productsFilteredResponse, setProductsFilteredresponse] = useState<IProductsResponse>(productsResponse)
  const [isLoading, setIsLoading] = useState(false);

  // USESTATE UI DE FILTROS
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<SharedSelection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState<SharedSelection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(productsResponse.products.length);
  // Descriptor de clasificacion
  const [sortDescriptor, setSortDescriptor] = useState<TSortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  // Función que maneja el cambio de selección
  const handleSelectionChange = (keys: SharedSelection) => {
    setStatusFilter(keys);
  };

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(productsResponse.meta.totalPages);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns])

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
    // Si esta en false no cargará de nuevo los productos
    if (!isMounted.current) {
      isMounted.current = true; // Marcar como montado
      return; // Saltar la ejecución inicial
    }

    const fetchProducts = async () => {
      console.log(Array.from(statusFilter).length === statusOptions.length)
      const response = await getProducts({
        limit: rowsPerPage,
        page: page,
        search: filterValue,
        status: Array.from(statusFilter).length === statusOptions.length || statusFilter === "all" ? "all" : String(Array.from(statusFilter)[0])
      });
      // console.log(response)
      setProductsFilteredresponse(response);
      setTotalPages(response.meta.totalPages);
      setIsLoading(false);
    }
    setIsLoading(true);
    fetchProducts(); // Llama a la funcion que llama a los productos con filtros(params)
  }, [rowsPerPage, page, filterValue, productsResponse, statusFilter]);

  // CONTROL DE LAS IMAGENES QUE TIENEN ERROR AL CARGAR
  const [imageErrors, setImageErrors] = useState<ImageErrors>({});
  useEffect(() => {
    setImageErrors({})
  }, [productsResponse])

  const handleImageError = (productId: string) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [productId]: true,
    }));
  };

  // Articulos ordenados
  const sortedItems = useMemo(() => {
    return [...productsFilteredResponse.products].sort((a, b) => {
      const first = a[sortDescriptor.column] ?? "";
      const second = b[sortDescriptor.column] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    })
  }, [sortDescriptor, productsFilteredResponse, statusFilter])

  // RENDERIZAR CELDA
  const renderCell = useCallback((product: ISimpleProduct, columnKey: keyof ISimpleProduct) => {

    switch (columnKey as string) {
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
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'><HighlinghtedText text={product.name} highlight={filterValue} /></p>
            <p className='text-bold text-xs capitalize text-default-400'>
              {product.composedByProducts
                .map(composition => `${composition.quantity}${composition.componentProduct.unit.abbreviation} ${composition.componentProduct.name}`)
                .join(", ")
              }
            </p>
          </div>
        );
      case "description":
        return (
          <div>
            <HighlinghtedText text={product.description} highlight={filterValue} />
          </div>
        );
      case "price":
        return `${product.price} Bs.`;
      case "createdAt":
        return product.createdAt.toLocaleString();
      case "status":
        return product.isEnable ? 'Activo' : 'Inactivo'
      case "categories":
        return (
          <div className="flex justify-center">
            <Popover placement='left'>
              <PopoverTrigger>
                <Button
                  isIconOnly
                  color='primary'
                  variant='shadow'
                // startContent={product.categories.length}
                >{product.categories.length}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <h3 className="text-small font-bold">
                    Categorías
                  </h3>
                  {
                    product.categories.map((item, index) => (
                      <div key={index} className="text-tiny">{item.name}</div>
                    ))
                  }
                </div>
              </PopoverContent>
            </Popover>
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
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {`${productsFilteredResponse.products.length} de ${productsFilteredResponse.meta.totalItems} productos`}
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
  }, [productsFilteredResponse, selectedKeys, page, totalPages, hasSearchFilter]);

  return (
    <section className='container pt-2'>

      <Modal isOpen={isOpen} onClose={onClose} placement='top' scrollBehavior='outside' >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Ventas de {modalTitle}</ModalHeader>
              <ModalBody>
                adsfsdf
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onPress={onClose}>Aceptar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Table
        aria-label='Lista de productos'
        selectedKeys={selectedRowKeys}
        onSelectionChange={(keys) => setSelectedRowKeys(keys)}
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
              align={column.uid === "categories" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'filtering'} emptyContent={"¡Ups! No encontramos nada aquí."} items={sortedItems}>
          {(items) => (
            <TableRow key={items.id}>
              {(columnKey) => <TableCell>{renderCell(items, columnKey as keyof ISimpleProduct)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
