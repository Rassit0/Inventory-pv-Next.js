"use client"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { DeleteProductModal, IInventoryByCategoryProduct, UpdateProductFormModal } from '@/modules/admin/products'
import Image from 'next/image'
import no_image from '@/assets/no_image.png'
import warning_error_image from '@/assets/warning_error.png'
import { HighlinghtedText } from '@/modules/admin/shared'


interface Props {
  products: IInventoryByCategoryProduct[];
}

type ImageErrors = {
  [key: string]: boolean; // Claves como strings (IDs) y valores booleanos
};

export const ProductModalTable = ({ products }: Props) => {
  // CONTROL DE LAS IMAGENES QUE TIENEN ERROR AL CARGAR
  const [imageErrors, setImageErrors] = useState<ImageErrors>({});
  useEffect(() => {
    setImageErrors({})
  }, [products])

  const handleImageError = (productId: string) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [productId]: true,
    }));
  };
  return (
    // <section className='container'>
      <Table
        aria-label='Lista de productos'
      >
        <TableHeader>
          <TableColumn>IMAGEN</TableColumn>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>STOCK</TableColumn>
          <TableColumn>UNIDAD</TableColumn>
        </TableHeader>

        <TableBody emptyContent={"¡Ups! No encontramos nada aquí."}>
          {
            products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
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
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.unit.name}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    // </section>
  )
}
