import { valeryClient } from "@/lib/api";
import { IHandlingUnitResponse, ISimpleHandlingUnit } from "@/modules/admin/handling-units";


export const getHandlingUnits = async (token: string = 'adfs'): Promise<ISimpleHandlingUnit[]> => {
    try {
        const response = await valeryClient<IHandlingUnitResponse>('/units',{
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        // Convertir las fechas a objetos Date
        const units = response.units.map((unit:ISimpleHandlingUnit) => ({
            ...unit,
            createdAt: new Date(unit.createdAt),
            updatedAt: new Date(unit.updatedAt)
        }))

        return units;
    } catch (error) {
        console.log(error)
        return []
    }
}