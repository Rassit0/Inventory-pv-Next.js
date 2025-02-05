"use server"

import { valeryClient } from "@/lib/api";
import { ICategoriesResponse, ISimpleCategory } from "@/modules/admin/categories"
import { toast } from "sonner";

export const getCategories = async (token: string = "asdf"): Promise<ISimpleCategory[]> => {

    try {
        const response = await valeryClient<ICategoriesResponse>('/categories', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        // Convertir las fechas a objetos Date
        const categories = response.categories.map((category: ISimpleCategory) => ({
            ...category,
            createdAt: new Date(category.createdAt),
            updatedAt: new Date(category.updatedAt)
        }));

        return categories;
    } catch (error) {
        console.log(error)
        return []
        // return {
        //     error: true,
        //     message: error
        // }
    }

}