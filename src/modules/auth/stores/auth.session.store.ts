import { create, StateCreator } from "zustand";
import { toast } from "sonner";
import { persist } from "zustand/middleware";
import { IUser } from "@/modules/auth";
import { redirect } from "next/navigation";

// Las variables q van a ser modificadas
interface SessionState {
    user: IUser | null;
    token: string | null;
}

// Las funciones del store
interface Actions {
    setSession: (user: IUser | null, token: string | null) => void;
    logout: () => void;
}

// La lógica
const storeApi: StateCreator<SessionState & Actions> = (set, get) => ({
    user: null,
    token: null,

    setSession: (user, token) => {
        set({ user, token });
    },

    logout: () => {
        set({ user: null, token: null });
        // window.location.reload(); // Recarga la página para limpiar completamente el estado
        // localStorage.removeItem("session-storage"); // Elimina la sesión guardada en localStorage
    }
});

// Exporta la lógica
export const useSessionStore = create<SessionState & Actions>()(
    //Hacer persistente el store para que no se pierda los datos al actualizar la pagina
    persist(
        storeApi,
        { name: "session-storage" } // Guarda la sesión con este nombre en localStorage
    )
    // storeApi
);