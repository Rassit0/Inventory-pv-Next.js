'use client'
import { ButtonNotifications, getNotifications, INotification } from '@/modules/admin/notifications'
import useSWR from 'swr';

interface Props {
    token: string;
}

export const NavMenuAlert = ({ token }: Props) => {
    // FUNCION PARA OBTENER NOTIFICACIONES
    const fetchNotifications = async () => {
        try {
            return await getNotifications({ token });
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
            return []; // En caso de error, retornar un array vacío
        }
    };

    // Hook SWR para obtener y actualizar las notificaciones
    const { data: notifications, error } = useSWR<INotification[]>('/notifications', fetchNotifications, {
        refreshInterval: 5000, // Se actualiza cada 5 segundos
        revalidateOnFocus: true, // Se actualiza cuando la página vuelve al foco
    });

    if (error) {
        console.error("Error cargando notificaciones:", error);
    }

    return <ButtonNotifications notifications={notifications || []} />;
}
