import { create, StateCreator } from "zustand";

interface UIState {
    isOpenMenu: boolean
}

interface Actions {
    handleMenuOpen: () => void
}

// LOGICA DE PROGRAMACION de tipo generico<>
const storeApi: StateCreator<UIState & Actions> = (set, get) => ({
    isOpenMenu: false,
    handleMenuOpen: () => {
        const { isOpenMenu } = get()
        set({
            isOpenMenu: !isOpenMenu
        })
    }
})

export const useUIStore = create(
    storeApi
)