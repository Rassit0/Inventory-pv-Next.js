"use client"
import React, { useEffect, useRef, useState } from 'react'
import { OrderCard } from './OrderCard'
import { getParallelGroups, getProductions, IParallelGroup, IProduction } from '@/modules/admin/production'
import { DatePicker, Spinner } from '@heroui/react';
import { CalendarDate, parseAbsolute, parseDate, ZonedDateTime } from '@internationalized/date';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { useUIStore } from '@/modules/admin/shared';

interface Props {
    orderProductions: IProduction[];
    token: string;
    parallelGroups: IParallelGroup[];
    editOrder: boolean;
}
export const OrderList = ({ orderProductions, token, parallelGroups, editOrder }: Props) => {

    const isMounted = useRef(false);

    // branchId seleccionado
    const { branchId } = useUIStore();

    const [orderProductionsFiltered, setOrderProductionsFiltered] = useState(orderProductions)
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
    const [filterDate, setFilterDate] = useState<CalendarDate | null>(parseDate(formatDate(new Date())));
    const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // SI SE CAMBIA DE URL SE PONE EN FALSO ISMOUNTED QUE ES PARA QUE NO SE ACTUALICE AL MONTAR EL COMPONENTE Y SOLO AL INGRESAR FILTROS O ACTUALIZAR LOS PRODUCTOS
    const pathname = usePathname();
    useEffect(() => {
        // funcion para el cambio de ruta y volver isMounteda false para que no se vuelva a cargar los productos iniciales que llegan al componente
        const handleRouteChange = () => {
            isMounted.current = false;
        }

        return () => {
            handleRouteChange();
        }
    }, [pathname])


    const fetchOrderProductions = async () => {

        // Convierte filterDate a un objeto Date y luego a ISO con zona horaria 'UTC'
        const isoDate = filterDate
            ? filterDate.toDate(systemTimeZone)
            : new Date();
        // setIsLoading(true); // Inicia la carga


        const response = await getProductions({
            token,
            orderBy: "desc",
            date: isoDate, // Usa el valor en formato ISO
            branchId
        });
        setOrderProductionsFiltered(response.productions);
        setIsLoading(false); // Finaliza la carga

        return response.productions
    };
    useSWR<IProduction[]>('/products', fetchOrderProductions, {
        refreshInterval: 5000, // Actualiza cada 5 segundos (puedes ajustar el intervalo)
        revalidateOnFocus: true, // Vuelve a validar los datos cuando la página vuelve al foco
    });

    useEffect(() => {
        // Si esta en false no cargará de nuevo los productos
        if (!isMounted.current) {
            isMounted.current = true; // Marcar como montado
            return; // Saltar la ejecución inicial
        }
        fetchOrderProductions();
    }, [filterDate, branchId, orderProductions])


    useEffect(() => {
        // Para que solo cargue si se filtra
        setIsLoading(true)
    }, [filterDate, branchId])

    return (
        <section className='pt-8 container space-y-2'>
            <div className="flex justify-between items-center mb-6 flex-col sm:flex-row">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Fecha de entrega: {filterDate?.toDate(systemTimeZone).toLocaleDateString('es-ES', {
                        weekday: 'long', // Día de la semana, por ejemplo: "lunes"
                        year: 'numeric', // Año completo, por ejemplo: "2025"
                        month: 'long', // Mes completo, por ejemplo: "marzo"
                        day: 'numeric', // Día del mes, por ejemplo: "27"
                    })}
                </h2>
                <DatePicker
                    size='lg'
                    className="w-full md:w-72"
                    label="Filtrar por Fecha de Entrega"
                    value={filterDate}
                    onChange={(value) => setFilterDate(value)}
                />
            </div>
            {/* Mostrar un indicador de carga si isLoading es true */}
            {isLoading ? (
                <div className="text-center py-8">
                    <Spinner size='lg' />
                    <p>Cargando...</p>
                </div>
            ) : (
                <ul className='grid md:grid-cols-2 2xl:grid-cols-3 gap-4'>
                    {
                        orderProductionsFiltered.length > 0 ?
                            orderProductionsFiltered.map(order => (
                                <li key={order.id}>
                                    <OrderCard
                                        token={token}
                                        parallelGroups={parallelGroups}
                                        order={order}
                                        editOrder={editOrder}
                                    />
                                </li>
                            ))
                            :
                            <div className="text-center py-8 col-span-full">
                                <p className='text-default-500'>Sin ordenes</p>
                            </div>
                    }
                </ul>
            )}
        </section>
    )
}
