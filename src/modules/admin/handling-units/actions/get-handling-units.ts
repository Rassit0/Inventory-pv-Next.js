import { valeryClient } from "@/lib/api";
import { IHandlingUnitResponse, ISimpleHandlingUnit } from "@/modules/admin/handling-units";

interface Props {
    token: string;
}
export const getHandlingUnits = async ({ token }: Props): Promise<ISimpleHandlingUnit[]> => {
    try {
        const response = await valeryClient<IHandlingUnitResponse>('/units', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        // Convertir las fechas a objetos Date
        const units = response.units.map((unit: ISimpleHandlingUnit) => ({
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