import { create, StateCreator } from "zustand";
import { toast } from "sonner";
import { persist } from "zustand/middleware";
import { IRecipe } from "@/modules/admin/production-recipes";

export interface IOrderCart {
    recipe: IRecipe;
    quantity: number;
    parallelGroup?: string; // Campo opcional para agrupar recetas
    isParallel: boolean;
    totalTimeRecipe: number;
}
// Las variables q van a ser modificadas
interface OrderCartState {
    orderCart: IOrderCart[];
    totalTime: number;
    parallelGroups: Record<string, IOrderCart[]>; // Registra los grupos paralelos por ID
}

// Las funciones del store
interface Actions {
    addRecipeToOrderCart: (product: IRecipe) => void;
    incrementQuantity: (id: string, groupId?: string) => void;
    decrementQuantity: (id: string, groupId?: string) => void;
    removeRecipeToOrderCart: (id: string) => void;
    assignToParallelGroup: (id: string, groupId: string) => void; // Asigna una receta a un grupo paralelo
    setIsParallel: (id: string, value: boolean) => void; // Nuevo método para actualizar isParallel a true

    calcTotal: () => void;
    cleanOrderCart: () => void;
}

// La lógica
const storeApi: StateCreator<OrderCartState & Actions> = (set, get) => ({
    orderCart: [],
    totalTime: 0,
    parallelMode: false,
    parallelGroups: {},
    addRecipeToOrderCart: (recipe: IRecipe) => {
        const { orderCart, calcTotal } = get();

        const recipeExists = orderCart.some(item => item.recipe.id == recipe.id)

        if (recipeExists) {
            toast.warning("La reeceta ya se agregó.");
            return;
        }

        set({
            orderCart: [...orderCart, { recipe: recipe, quantity: 1, isParallel: false, totalTimeRecipe: recipe.preparationTime }]
        })

        toast.success('Producto agregado al carrito');
        calcTotal();
    },
    incrementQuantity: (id: string, groupId?: string) => {
        const { orderCart, parallelGroups, calcTotal } = get();

        // Verifica si el producto está en un grupo paralelo
        if (groupId) {
            // Si tiene un `groupId`, significa que está en un grupo paralelo
            const updatedParallelGroups = { ...parallelGroups };

            if (updatedParallelGroups[groupId]) {
                updatedParallelGroups[groupId] = updatedParallelGroups[groupId].map(item => {
                    if (item.recipe.id === id) {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                    return item;
                });
                set({ parallelGroups: updatedParallelGroups });
            }
        } else {
            // Si no tiene un `groupId`, es un producto normal en el carrito
            const updatedOrderCart = orderCart.map(item => {
                if (item.recipe.id === id) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            set({ orderCart: updatedOrderCart });
        }

        calcTotal();
    },
    decrementQuantity: (id: string, groupId?: string) => {
        const { orderCart, parallelGroups, removeRecipeToOrderCart, calcTotal } = get();

        // Verifica si el producto está en un grupo paralelo
        if (groupId) {
            // Si tiene un `groupId`, significa que está en un grupo paralelo
            const updatedParallelGroups = { ...parallelGroups };

            if (updatedParallelGroups[groupId]) {
                // Encuentra el ítem a eliminar y elimina el grupo paralelo
                const removedItem = updatedParallelGroups[groupId].find(item => item.recipe.id === id);

                if (removedItem?.quantity === 1) {
                    updatedParallelGroups[groupId] = updatedParallelGroups[groupId].filter(item => item.recipe.id !== id);
                } else {
                    updatedParallelGroups[groupId] = updatedParallelGroups[groupId].map(item => {
                        if (item.recipe.id === id) {
                            return {
                                ...item,
                                quantity: item.quantity - 1
                            }
                        }
                        return item;
                    });
                }

                // Si el grupo queda vacío, lo eliminamos
                if (updatedParallelGroups[groupId].length === 0) {
                    delete updatedParallelGroups[groupId];
                }

                set({ parallelGroups: updatedParallelGroups });

                // Si el item eliminado estaba en un grupo, restablece su parallelGroup a undefined
                if (removedItem) {
                    set({
                        orderCart: orderCart.map(item =>
                            item.recipe.id === removedItem.recipe.id ? { ...item, parallelGroup: undefined } : item
                        )
                    });
                }

            }
        } else {
            // Si no tiene un `groupId`, es un producto normal en el carrito
            const updatedOrderCart = orderCart.map(item => {
                if (item.recipe.id === id && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                // Si la cantidad es 1, elimina la receta del carrito
                if (item.recipe.id === id && item.quantity === 1) {
                    removeRecipeToOrderCart(id);
                    return null; // Esto es solo para eliminar, no se debe agregar `null` a la lista
                }
                return item;
            }).filter((item): item is IOrderCart => item !== null); // Filtra los `null`

            set({ orderCart: updatedOrderCart });
        }

        calcTotal();
    },
    removeRecipeToOrderCart: (id: string, groupId?: string) => {
        const { orderCart, parallelGroups, calcTotal } = get();

        // Si se proporciona un `groupId`, elimina la receta de ese grupo paralelo
        if (groupId) {
            const updatedParallelGroups = { ...parallelGroups };

            if (updatedParallelGroups[groupId]) {
                // Filtra el grupo paralelo y elimina la receta
                updatedParallelGroups[groupId] = updatedParallelGroups[groupId].filter(item => item.recipe.id !== id);

                // Si después de eliminar la receta el grupo queda vacío, podemos eliminar el grupo si lo deseas
                if (updatedParallelGroups[groupId].length === 0) {
                    delete updatedParallelGroups[groupId];
                }

                set({ parallelGroups: updatedParallelGroups });
            }
        } else {
            // Si no hay `groupId`, elimina de `orderCart`
            const updatedOrderCart = orderCart.filter(item => item.recipe.id !== id);
            set({ orderCart: updatedOrderCart });
        }

        // Recalcula el total después de eliminar el producto
        calcTotal();
    },
    assignToParallelGroup: (id: string, groupId: string) => {
        const { orderCart, parallelGroups, calcTotal } = get();

        // Encuentra la receta en el carrito y actualiza el grupo paralelo
        const updatedOrderCart = orderCart.map(item =>
            item.recipe.id === id ? { ...item, parallelGroup: groupId } : item
        );

        // Si el grupo paralelo no existe, crearlo
        const updatedParallelGroups = { ...parallelGroups };
        if (!updatedParallelGroups[groupId]) {
            updatedParallelGroups[groupId] = [];
        }

        // Asegúrate de que la receta se agregue solo una vez al grupo paralelo
        const newRecipes = updatedOrderCart.filter(item => item.parallelGroup === groupId);
        const currentGroupRecipes = updatedParallelGroups[groupId];

        // Filtra las recetas duplicadas, solo agregando las nuevas
        updatedParallelGroups[groupId] = [
            ...currentGroupRecipes,
            ...newRecipes.filter(newItem =>
                !currentGroupRecipes.some(existingItem => existingItem.recipe.id === newItem.recipe.id)
            )
        ];

        // Actualiza el estado con el carrito y los grupos paralelos actualizados
        set({ orderCart: updatedOrderCart, parallelGroups: updatedParallelGroups });
        calcTotal();
    },
    setIsParallel: (id: string, value: boolean) => {
        const { orderCart, calcTotal } = get();

        const updatedOrderCart = orderCart.map(item => {
            if (item.recipe.id === id) {
                return { ...item, isParallel: value };
            }
            return item;
        });

        set({ orderCart: updatedOrderCart });
        calcTotal(); // Optional: recalculate the total time if needed
    },
    calcTotal: () => {
        const { orderCart, parallelGroups } = get();

        let subTotal = 0;
        let parallelTotalTime = 0;

        // Mapear el carrito y actualizar los tiempos
        const updatedOrderCart = orderCart.map(item => {
            if ((item.isParallel && item.parallelGroup) || item.isParallel) {
                // Si es paralelo, no sumamos directamente, lo manejaremos en el bloque de parallelGroups
                return { ...item, totalTimeRecipe: item.recipe.preparationTime };
            } else {
                // Si no es paralelo, calculamos el tiempo de preparación normal
                return { ...item, totalTimeRecipe: item.recipe.preparationTime * item.quantity };
            }
        });

        // Sumar tiempos de recetas no paralelas
        updatedOrderCart.forEach(item => {
            subTotal += item.totalTimeRecipe;
            // if (!item.isParallel) {
            // }
        });

        // Calcular el tiempo total para los grupos paralelos
        Object.values(parallelGroups).forEach(group => {
            if (group.length > 0) {
                const maxTime = Math.max(...group.map(item => item.recipe.preparationTime));
                parallelTotalTime += maxTime; // Solo sumamos el mayor tiempo dentro del grupo
            }
        });

        set({ orderCart: updatedOrderCart, totalTime: subTotal + parallelTotalTime });
    },
    cleanOrderCart: () => {
        set({
            orderCart: [],
            totalTime: 0,
            parallelGroups: {} // Elimina también los grupos paralelos
        });
    }
});

// Exporta la lógica
export const useOrderCartStore = create<OrderCartState & Actions>()(
    //Hacer persistente el store para que no se pierda los datos al actualizar la pagina
    persist(
        storeApi,
        { name: "order-cart-menu-storage" } // Va guardar la info en el storage con este nombre
    )
    // storeApi
);