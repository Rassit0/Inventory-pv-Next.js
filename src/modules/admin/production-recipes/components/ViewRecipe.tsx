'use client'
import React, { useState } from 'react'
import { IRecipe } from '@/modules/admin/production-recipes'
import Image from 'next/image'
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import useSWR from 'swr';

interface Props {
    recipe: IRecipe
    token: string;
}

export const ViewRecipe = ({ token, recipe }: Props) => {
    const [recipeInfo, setRecipeInfo] = useState(recipe)

    // Función para actualizar la receta con datos nuevos si es necesario
    const fetchRecipe = async () => {
        const response = await fetch(`/api/recipes/${recipe.id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data) {
            setRecipeInfo(data);
        }
        return data || recipe;
    }

    useSWR<IRecipe>(`/recipes/${recipe.id}`, fetchRecipe, {
        refreshInterval: 5000, // Actualiza cada 5 segundos (ajustable)
        revalidateOnFocus: true, // Revalidación al recuperar el foco de la página
    });

    const [imageError, setImageError] = useState(false);

    return (
        <div className="p-6 bg-white shadow-md rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previsualización de la imagen */}
            <div className="relative w-full h-[500px] md:h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <Image
                    src={imageError ? warning_error_image : recipeInfo.imageUrl || no_image}
                    alt="Vista previa"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="rounded-lg object-contain"
                    onError={() => setImageError(true)}
                />
            </div>

            <div className="flex flex-col space-y-6">
                {/* Estado de la receta */}
                <div className="flex justify-between items-center">
                    <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${recipeInfo.isEnable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                    >
                        {recipeInfo.isEnable ? 'Disponible' : 'No disponible'}
                    </span>
                </div>

                {/* Descripción */}
                <div>
                    <h4 className="text-lg font-medium text-gray-700">Descripción:</h4>
                    <p className="text-sm text-gray-600">{recipeInfo.description}</p>
                </div>

                {/* Instrucciones de preparación */}
                <div>
                    <h4 className="text-lg font-medium text-gray-700">Instrucciones de preparación:</h4>
                    <p className="text-sm text-gray-600">{recipeInfo.preparationInstructions}</p>
                </div>

                {/* Tiempo de preparación */}
                <div>
                    <h4 className="text-lg font-medium text-gray-700">Tiempo de preparación:</h4>
                    <p className="text-sm text-gray-600">{recipeInfo.preparationTime} minutos</p>
                </div>

                {/* Ingredientes */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Ingredientes:</h3>
                    <div className="space-y-4">
                        {recipeInfo.items.map((item) => (
                            <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                <h4 className="text-lg font-semibold text-gray-800">{item.product.name}</h4>
                                <p className="text-sm text-gray-600">Cantidad: <span className="font-semibold text-gray-900">{item.quantity}</span></p>
                                <p className="text-sm text-gray-600">Unidad: <span className="font-semibold text-gray-900">{item.product.unit.name} ({item.product.unit.abbreviation})</span></p>
                                {/* <p className="text-sm text-gray-600">Stock mínimo: <span className="font-semibold text-gray-900">{item.product.minimumStock}</span></p>
                                <p className="text-sm text-gray-600">Punto de reorden: <span className="font-semibold text-gray-900">{item.product.reorderPoint}</span></p> */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detalles de producción */}
                {/* <div>
                    <h3 className="text-lg font-medium text-gray-800">Detalles de producción:</h3>
                    <div className="space-y-4">
                        {recipeInfo.ProductionDetail.map((production) => (
                            <div key={production.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                <h4 className="text-lg font-semibold text-gray-800">Producción ID: {production.productionId}</h4>
                                <p className="text-sm text-gray-600">Cantidad: <span className="font-semibold text-gray-900">{production.quantity}</span></p>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Fechas */}
                <div>
                    <p><strong>Fecha de creación:</strong> {new Date(recipeInfo.createdAt).toLocaleDateString()}</p>
                    <p><strong>Última actualización:</strong> {new Date(recipeInfo.updatedAt).toLocaleDateString()}</p>
                    <p><strong>Fecha de eliminación:</strong> {recipeInfo.deletedAt ? new Date(recipeInfo.deletedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};
