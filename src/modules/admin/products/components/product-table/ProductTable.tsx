"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, SharedSelection, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DeleteProductModal, getProducts, IProduct, IProductResponse, UpdateProductFormModal } from '@/modules/admin/products'
import Image from 'next/image'
import no_image from '@/assets/no_image.png'
import warning_error_image from '@/assets/warning_error.png'
import { ISimpleCategory } from '@/modules/admin/categories'
import { ISimpleHandlingUnit } from '@/modules/admin/handling-units'
import { ArrowDown01Icon, PlusMinus01Icon, Search01Icon } from 'hugeicons-react'
import { HighlinghtedText } from '@/modules/admin/shared'
import { usePathname } from 'next/navigation'


interface Props {
  productsResponse: IProductResponse;
  allProducts: IProduct[];
  categories: ISimpleCategory[];
  handlingUnits: ISimpleHandlingUnit[];
}

const columns = [
  { name: "IMAGEN", uid: "image", sortable: true },
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
  column: keyof IProduct; // Esto asegura que 'column' sea una de las claves de ISimpleProduct
  direction: 'ascending' | 'descending';
};

const INITIAL_VISIBLE_COLUMNS: string[] = ["image", "name", "description", "price", "status", "actions"];

export const ProductTable = ({ productsResponse, allProducts, categories, handlingUnits }: Props) => {
  const isMounted = useRef(false);
  const [productsFilteredResponse, setProductsFilteredresponse] = useState<IProductResponse>(productsResponse)
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
      const response = await getProducts({
        limit: rowsPerPage,
        page: page,
        search: filterValue,
        status: Array.from(statusFilter).length === statusOptions.length || statusFilter === "all" ? "all" : String(Array.from(statusFilter)[0])
      });
      // console.log(response)
      setProductsFilteredresponse(response!);
      setTotalPages(response!.meta.totalPages);
      setIsLoading(false);
    }
    setIsLoading(true);
    fetchProducts(); // Llama a la funcion que llama a los productos con filtros(params)
  }, [rowsPerPage, page, filterValue, productsResponse, statusFilter]);

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
  const renderCell = useCallback((product: IProduct, columnKey: keyof IProduct) => {

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
            <p className='text-bold text-sm'><HighlinghtedText text={product.name} highlight={filterValue} /></p>
            <p className='text-bold text-xs text-default-400'>
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
      case "actions":
        return (
          <div className="flex">
            <UpdateProductFormModal
              categories={categories}
              product={product}
              products={allProducts}
              handlingUnits={handlingUnits}
            />
            <DeleteProductModal productId={product.id} />
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
  }, [productsFilteredResponse, page, totalPages, hasSearchFilter]);

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
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'filtering'} emptyContent={"¡Ups! No encontramos nada aquí."} items={sortedItems}>
          {(items) => (
            <TableRow key={items.id}>
              {(columnKey) => <TableCell>{renderCell(items, columnKey as keyof IProduct)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
