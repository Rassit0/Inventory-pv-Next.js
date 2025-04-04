import { create, StateCreator } from "zustand";
import { toast } from "sonner";
import { persist } from "zustand/middleware";
import { IRecipe } from "@/modules/admin/production-recipes";

interface IOrderCart{
    recipe:IRecipe;
    quantity: number
}
// Las variables q van a ser modificadas
interface OrderCartState {
    orderCart: IOrderCart[];
    totalTime: number;
}

// Las funciones del store
interface Actions {
    addRecipeToOrderCart: (product: IRecipe) => void;
    incrementQuantity: (id: string) => void;
    decrementQuantity: (id: string) => void;
    removeRecipeToOrderCart: (id: string) => void;

    calcTotal: () => void;
    cleanOrderCart: () => void;
}

// La lógica
const storeApi: StateCreator<OrderCartState & Actions> = (set, get) => ({
    orderCart: [],
    totalTime: 0,
    addRecipeToOrderCart: (recipe: IRecipe) => {
        const { orderCart, calcTotal } = get();

        const recipeExists = orderCart.some(item => item.recipe.id == recipe.id)

        if (recipeExists) {
            toast.warning("La reeceta ya se agregó.");
            return;
        }

        set({
            orderCart: [...orderCart, {recipe: recipe, quantity: 1}]
        })

        toast.success('Producto agregado al carrito');
        calcTotal();
    },
    incrementQuantity: (id: string) => {
        const { orderCart, calcTotal } = get();

        const updateCartProducts = orderCart.map(item => {
            if (item.recipe.id == id) {
                return { ...item, quantity: item.quantity + 1 }
            }

            return item;
        });

        set({ orderCart: updateCartProducts }); // toma el listado actualizado
        calcTotal();
    },
    decrementQuantity: (id: string) => {
        const { orderCart, removeRecipeToOrderCart, calcTotal } = get();

        // Si ya es uno y se decrementa, se eliminar el producto del carrito
        const deleteProductToCart = orderCart.filter(item => item.recipe.id == id);
        if (deleteProductToCart[0].quantity === 1) {
            removeRecipeToOrderCart(id);
            return;
        }

        const updateCartProducts = orderCart.map(item => {
            if (item.quantity == 1) {
                return item;
            }

            if (item.recipe.id === id) {
                return { ...item, quantity: item.quantity - 1 }
            }

            return item;
        });

        set({ orderCart: updateCartProducts });
        calcTotal();
    },
    removeRecipeToOrderCart: (id: string) => {
        const { orderCart, calcTotal } = get();

        const updateCartProducts = orderCart.filter(item => item.recipe.id != id);

        set({ orderCart: updateCartProducts });
        calcTotal();
    },
    calcTotal: () => {
        const { orderCart } = get();

        let subTotal = 0;

        orderCart.forEach(item => {
            subTotal += item.recipe.preparationTime * item.quantity;
        });

        set({ totalTime: subTotal });
    },
    cleanOrderCart: () => {
        set({ orderCart: [], totalTime: 0 })
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