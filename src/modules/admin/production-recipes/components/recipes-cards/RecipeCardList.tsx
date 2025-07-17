"use client"
import React, { useState } from 'react'
import { IRecipesResponse } from '@/modules/admin/production-recipes'
import { RecipeCard } from '@/modules/admin/production-recipes';
import { IProductsResponse } from '@/modules/admin/products';
import { IBranch } from '@/modules/admin/branches';
import { IWarehouse } from '@/modules/admin/warehouses';
interface Props {
    token: string;
    writeProduction: boolean;
    editRecipe: boolean;
    deleteRecipe: boolean;
    recipesResponse: IRecipesResponse;
    productsResponse: IProductsResponse
    branches: IBranch[];
    warehouses: IWarehouse[];
}

const statusOptions = [
    { name: "Activo", uid: "active" },
    { name: "Inactivo", uid: "inactive" },
];

export const RecipeCardList = ({ token, writeProduction, deleteRecipe, editRecipe, recipesResponse, branches, productsResponse, warehouses }: Props) => {


    if (!recipesResponse.recipes || recipesResponse.recipes.length === 0) {
        return (
            <div className="container pt-8">
                <p className="text-center text-gray-500">No hay recetas disponibles.</p>
            </div>
        );
    }

    return (
        <div className="container pt-8 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
            {recipesResponse.recipes.map((item, index) => (
                <RecipeCard
                    token={token}
                    writeProduction={writeProduction}
                    editRecipe={editRecipe}
                    deleteRecipe={deleteRecipe}
                    key={index}
                    recipe={item}
                    branches={branches}
                    productsResponse={productsResponse}
                    warehouses={warehouses}
                />
            ))}
        </div>
    )
}
