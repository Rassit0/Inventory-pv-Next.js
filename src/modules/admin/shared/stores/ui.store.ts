import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { deleteCookieBranchId, setCookieBranchId } from "@/modules/admin/branches";

interface UIState {
    isOpenMenu: boolean
    isOpenOrderMenu: boolean
    branchId?: string;
}

interface Actions {
    handleMenuOpen: () => void
    handleOrderMenuOpen: () => void
    handleChangeBranchId: (id: string | undefined) => Promise<void>
}

// LOGICA DE PROGRAMACION de tipo generico<>
const storeApi: StateCreator<UIState & Actions> = (set, get) => ({
    isOpenMenu: false,
    isOpenOrderMenu: false,
    branchId: undefined,
    handleMenuOpen: () => {
        const { isOpenMenu } = get()
        set({
            isOpenMenu: !isOpenMenu
        })
    },
    handleOrderMenuOpen: () => {
        const { isOpenOrderMenu } = get()
        set({
            isOpenOrderMenu: !isOpenOrderMenu
        })
    },
    handleChangeBranchId: async (id: string | undefined) => {
        if (id) {
            await setCookieBranchId(id);
        } else {
            await deleteCookieBranchId();
        }
        set({
            branchId: id
        })
    }
})

// export const useUIStore = create(
//     storeApi
// )

// Exporta la lógica
export const useUIStore = create<UIState & Actions>()(
    //Hacer persistente el store para que no se pierda los datos al actualizar la pagina
    persist(
        storeApi,
        { name: "ui-session-storage" } // Guarda la sesión con este nombre en localStorage
    )
    // storeApi
);