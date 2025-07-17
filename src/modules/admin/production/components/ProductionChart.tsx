"use client"
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getProductions, getSummaryMonthlyCounts, IProductionOrder } from '@/modules/admin/production';
import { useUIStore } from '../../shared';
import useSWR from 'swr';
import { IMonthlyOrdersCounts, IMonthlyOrderCount } from '@/modules/admin/production';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { ProductLoadingIcon } from 'hugeicons-react';

interface Props {
    token: string;
    monthlyCounts: IMonthlyOrdersCounts | null;
    createdByUserId?: string;
}

// // Solo cargar el componente Table dinámicamente
// Solo usar si se va renderizar en el servidor
// const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });

export const ProductionChart = ({ token, monthlyCounts, createdByUserId }: Props) => {
    // Para cargar el primer response sin que se active el efecto
    const isFirstRender = useRef(true);
    const { branchId } = useUIStore();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{ name: string, value: IMonthlyOrderCount }[]>(
        Object.entries(monthlyCounts ?? {}).map(([key, value]: [string, IMonthlyOrderCount]) => ({ name: key, value: value }))
    );
    const [monthlyCountsFiltered, setMonthlyCountsFiltered] = useState<IMonthlyOrdersCounts | null>(monthlyCounts);

    // FUNCION PARA ACTUALIZAR LOS PRODUCTOS CON FILTROS O SI SE ACTUALIZA UN PRODUCTO
    const fetchProductionOrders = async () => {
        if (branchId) {
            setIsLoading(true);
            const response = await getSummaryMonthlyCounts({
                token,
                // createdByUserId,
                originBranchId: branchId,
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
    useSWR<IMonthlyOrdersCounts | null>('/production/summary/monthly-counts', fetchProductionOrders, {
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

        fetchProductionOrders(); // Llama a la funcion que llama a los productos con filtros(params)

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
                <h3 className="text-lg font-semibold text-gray-700">Ordenes de Producción</h3>
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
                                dataKey="value.PENDING"
                                stroke="#facc15"
                                fill="#fef08a"
                                name="Pendientes"
                            />
                            <Area
                                type="monotone"
                                dataKey="value.IN_PROGRESS"
                                stroke="#3b82f6"
                                fill="#bfdbfe"
                                name="En progreso"
                            />
                            <Area
                                type="monotone"
                                dataKey="value.COMPLETED"
                                stroke="#10b981"
                                fill="#bbf7d0"
                                name="Completadas"
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
