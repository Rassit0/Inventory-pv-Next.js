"use server"

import { valeryClient } from "@/lib/api";
import { INotification } from "../interfaces/notifications-response";

interface Props {
    token: string;
}
export const getNotifications = async ({token}:Props): Promise<INotification[]> => {

    try {
        const response = await valeryClient<INotification[]>('/notifications/get-low-stock-products', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        return response;
    } catch (error) {
        console.log(error)
        return []
    }

}