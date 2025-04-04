'use client'
import React, { useState } from 'react'
import { findProduct, IProduct } from '@/modules/admin/products'
import Image from 'next/image'
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { Product } from '../../handling-units/interfaces/simple-hanlding-unit';
import useSWR from 'swr';

interface Props {
    product: IProduct
    token: string;
    term: string;
}

export const ViewProduct = ({ term, token, product }: Props) => {
    const [productInfo, setProductInfo] = useState(product)
    // FUNCION PARA ACTUALIZAR LOS PRODUCTOS CON FILTROS O SI SE ACTUALIZA UN PRODUCTO
    const fetchProduct = async () => {
        const response = await findProduct({
            token,
            term
        });
        if (response) {
            setProductInfo(response)
        }
        return response || product;
    }
    useSWR<IProduct>('/products', fetchProduct, {
        refreshInterval: 5000, // Actualiza cada 5 segundos (puedes ajustar el intervalo)
        revalidateOnFocus: true, // Vuelve a validar los datos cuando la página vuelve al foco
    });
    const [imageError, setImageError] = useState(false);
    const productTypeTranslations: { [key in "RawMaterial" | "FinalProduct" | "Supply" | "Ingredient" | "Recipe"]: string } = {
        RawMaterial: "Materia prima",
        FinalProduct: "Producto final",
        Supply: "Insumo",
        Ingredient: "Ingrediente",
        Recipe: "Receta que combina productos"
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previsualización de la imagen */}
            <div className="relative w-full h-[500px] md:h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <Image
                    src={imageError ? warning_error_image : productInfo.imageUrl || no_image}
                    alt='Vista previa'
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className='rounded-lg object-contain'
                    onError={() => setImageError(true)}
                />
            </div>

            <div className="flex flex-col space-y-6">
                {/* Estado del producto */}
                <div className="flex justify-between items-center">
                    <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${productInfo.isEnable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                    >
                        {productInfo.isEnable ? 'Disponible' : 'No disponible'}
                    </span>
                </div>

                {/* Stock */}
                <div>
                    <h4 className="text-lg font-medium text-gray-700">Stock mínimo:
                        <span className="font-semibold text-gray-900">{productInfo.minimumStock}</span>
                    </h4>
                    <p className="text-sm text-gray-600">Reordenar a:
                        <span className="font-semibold text-gray-900">{productInfo.reorderPoint}</span>
                    </p>
                </div>

                {/* Stock por Almacén */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Stock por Almacén:</h3>
                    <div className="space-y-4">
                        {productInfo.warehouseProductStock?.map((stock) => (
                            <div key={stock.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                <h4 className="text-lg font-semibold text-gray-800">{stock.nameWarehouse || "Almacén Desconocido"}</h4>
                                <p className="text-sm text-gray-600">Stock disponible:
                                    <span className="font-semibold text-gray-900">{stock.stock}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock por Sucursal */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Stock por Sucursal:</h3>
                    <div className="space-y-4">
                        {productInfo.branchProductStock?.map((stock) => (
                            <div key={stock.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                <h4 className="text-lg font-semibold text-gray-800">{stock.nameBranch || "Sucursal Desconocida"}</h4>
                                <p className="text-sm text-gray-600">Stock disponible:
                                    <span className="font-semibold text-gray-900">{stock.stock}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categorías */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Categorías:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {productInfo.categories.map((category) => (
                            <li key={category.id}>{category.name}</li>
                        ))}
                    </ul>
                </div>

                {/* Tipos de producto */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Tipos de producto:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {productInfo.types.map((type) => (
                            <li key={type.id}>{productTypeTranslations[type.type as keyof typeof productTypeTranslations]}</li>
                        ))}
                    </ul>
                </div>

                {/* Unidad */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Unidad:</h3>
                    <p className="text-gray-700">{productInfo.unit.name} ({productInfo.unit.abbreviation})</p>
                </div>

                {/* Fechas */}
                {/* <div>
                    <p><strong>Fecha de lanzamiento:</strong> {productInfo.launchDate ? new Date(productInfo.launchDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Fecha de expiración:</strong> {productInfo.expirationDate ? new Date(productInfo.expirationDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Última venta:</strong> {productInfo.lastSaleDate ? new Date(productInfo.lastSaleDate).toLocaleDateString() : 'N/A'}</p>
                </div> */}
            </div>
        </div>
    )
}
