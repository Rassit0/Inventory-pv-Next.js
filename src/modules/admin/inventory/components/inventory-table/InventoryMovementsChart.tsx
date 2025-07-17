"use client"
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getSummaryMonthlyCounts } from '@/modules/admin/inventory';
import { useUIStore } from '@/modules/admin/shared';
import useSWR from 'swr';
import { IMonthlyOrdersCounts, IMonthlyOrderCount } from '@/modules/admin/inventory';
import { Card, CardBody, CardHeader } from '@heroui/react';

interface Props {
    token: string;
    title?: string;
    monthlyCounts: IMonthlyOrdersCounts | null;
    createdByUserId?: string;
    movementType?: "INCOME" | "OUTCOME" | "TRANSFER" | "ADJUSTMENT" | "all"
    adjustmentType?: "INCOME" | "OUTCOME" | "all"
}

// // Solo cargar el componente Table dinámicamente
// Solo usar si se va renderizar en el servidor
// const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });

export const InventoryMovementsChart = ({ token, monthlyCounts, createdByUserId, movementType, adjustmentType, title }: Props) => {
    const movementTypeLabels: Record<NonNullable<Props["movementType"]>, string> = {
        INCOME: "Ingresos",
        OUTCOME: "Egresos",
        TRANSFER: "Transferencias",
        ADJUSTMENT: "Ajustes",
        all: "Todos los movimientos",
    };
    // Para cargar el primer response sin que se active el efecto
    const isFirstRender = useRef(true);
    const { branchId } = useUIStore();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{ name: string, value: IMonthlyOrderCount }[]>(
        Object.entries(monthlyCounts ?? {}).map(([key, value]: [string, IMonthlyOrderCount]) => ({ name: key, value: value }))
    );
    const [monthlyCountsFiltered, setMonthlyCountsFiltered] = useState<IMonthlyOrdersCounts | null>(monthlyCounts);

    // FUNCION PARA ACTUALIZAR LOS PRODUCTOS CON FILTROS O SI SE ACTUALIZA UN PRODUCTO
    const fetchsummaryMonthlyCounts = async () => {
        if (branchId) {
            const response = await getSummaryMonthlyCounts({
                token,
                createdByUserId,
                ...((movementType === 'OUTCOME' || movementType === 'TRANSFER') && { originBranchId: branchId }),
                ...((movementType === 'INCOME') && { destinationBranchId: branchId }),
                movementType,
                ...(movementType === 'ADJUSTMENT' && { adjustmentType })
            });
            console.log(response)
            // console.log(response)
            setMonthlyCountsFiltered(response);
            // setTotalPages(response!.meta.totalPages);
            setIsLoading(false);
            return response;
        }
        return null
    }
    useSWR<IMonthlyOrdersCounts | null>(`/inventory/summary/monthly-counts?movementType=${movementType}`, fetchsummaryMonthlyCounts, {
        refreshInterval: 5000, // Actualiza cada 5 segundos (puedes ajustar el intervalo)
        revalidateOnFocus: true, // Vuelve a validar los datos cuando la página vuelve al foco
    });
    useEffect(() => {
        console.log(data)
        // Si esta en false no cargará de nuevo los productos
        if (!isFirstRender.current || branchId) {
            isFirstRender.current = true; // Marcar como montado
            return; // Saltar la ejecución inicial
        }

        setIsLoading(true);
        fetchsummaryMonthlyCounts(); // Llama a la funcion que llama a los productos con filtros(params)

    }, [monthlyCounts, createdByUserId, branchId, token]);

    useEffect(() => {
        if (!monthlyCountsFiltered) return; // Evita cálculos innecesarios
        const chartData = Object.entries(monthlyCountsFiltered ?? {}).map(
            ([key, value]: [string, IMonthlyOrderCount]) => ({ name: key, value })
        );
        setData(chartData);
    }, [monthlyCountsFiltered])

    return (
        <Card className="w-full" shadow='sm'>
            <CardHeader className="flex gap-3">
                <h3 className="text-lg font-semibold text-gray-700">
                    {title ? `${title}` : 'Gráfico'}
                </h3>
            </CardHeader>
            <CardBody>
                <div className='w-full h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            // width={500}
                            // height={300}
                            data={data}
                            margin={{ top: 3, right: 30, left: 0, bottom: 3 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="value.COMPLETED"
                                stroke="#10b981"
                                fill="#bbf7d0"
                                name="Completadas"
                            />
                            <Area
                                type="monotone"
                                dataKey="value.PENDING"
                                stroke="#facc15"
                                fill="#fef08a"
                                name="Pendientes"
                            />
                            <Area
                                type="monotone"
                                dataKey="value.ACCEPTED"
                                stroke="#3b82f6"
                                fill="#bfdbfe"
                                name="Aceptadas"
                            />
                            <Area
                                type="monotone"
                                dataKey="value.CANCELED"
                                stroke="#ef4444"
                                fill="#fecaca"
                                name="Canceladas"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardBody>
        </Card>
    );
}
