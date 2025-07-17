"use client"
import React, { useEffect, useRef, useState } from 'react'
import { DashboardCard } from './DashboardCard'
import { BoxerIcon, FactoryIcon, Leaf01Icon, ListViewIcon, Store01Icon, TaxesIcon } from 'hugeicons-react'
import { getSummaryCounts, ISummaryCounts } from '@/modules/admin/home'
import { useUIStore } from '@/modules/admin/shared';
import useSWR from 'swr'
import { getOrdersCount, getSummaryMonthlyCounts, IMonthlyOrdersCounts, IOrdersCount } from '../../production'
import { getCountRecipes, ICountRecipes } from '@/modules/admin/production-recipes'
import { IWasteReports } from '@/modules/admin/inventory'
import { IBranchesCount } from '@/modules/admin/branches'

interface props {
    token: string;
    // summaryData: ISummaryCounts
    monthlyOrdersCounts: IMonthlyOrdersCounts | null;
    recipesCount: ICountRecipes;
    branchesCount: IBranchesCount;
    wasteReportsCount: IWasteReports;
}

export const ListDashboardCards = ({ branchesCount, monthlyOrdersCounts: moc, recipesCount, wasteReportsCount, token }: props) => {
    // Para cargar el primer response sin que se active el efecto
    const isFirstRender = useRef(false);
    const { branchId } = useUIStore();
    const [isLoading, setIsLoading] = useState(false);

    // const [summaryCountsFiltered, setSummaryCountsFiltered] = useState<ISummaryCounts | null>(branchId ? null : summary);
    const [monthlyOrdersCountsFiltered, setMonthlyOrdersCountsFiltered] = useState<IMonthlyOrdersCounts | null>(moc)
    const [recipesCountFilteered, setRecipesCountFilteered] = useState<ICountRecipes | null>(recipesCount)
    const [branchesCountFilteered, setBranchesCountFilteered] = useState<IBranchesCount | null>(branchId ? null : branchesCount)
    const [wasteReportsCountFilteered, setWasteReportsCountFilteered] = useState<IWasteReports | null>(branchId ? null : wasteReportsCount)

    // FUNCION PARA ACTUALIZAR LOS PRODUCTOS CON FILTROS O SI SE ACTUALIZA UN PRODUCTO
    const fetchSummaryCounts = async () => {
        if (branchId) {
            // setIsLoading(true);
            const response = await getSummaryMonthlyCounts({ token, originBranchId: branchId, year: new Date().getFullYear() });
            console.log(response)
            // console.log(response)
            setMonthlyOrdersCountsFiltered(response);
            setIsLoading(false);
            // setTotalPages(response!.meta.totalPages);
            return response;
        }
        return null;
    }
    useSWR<IMonthlyOrdersCounts | null>('/production/summary', fetchSummaryCounts, {
        refreshInterval: 5000, // Actualiza cada 5 segundos (puedes ajustar el intervalo)
        revalidateOnFocus: true, // Vuelve a validar los datos cuando la página vuelve al foco
    });
    useEffect(() => {
        console.log(monthlyOrdersCountsFiltered)
        // Si es el primer render y no existe branchId no cargará de nuevo los productos
        if (!isFirstRender.current || !branchId) {
            isFirstRender.current = true; // Marcar como montado
        }

        if (branchId)
            setIsLoading(true)
        fetchSummaryCounts(); // Llama a la funcion que llama a los productos
        fetchCountRecipes(); // Llama a la funcion que llama al conteo de recetas
    }, [moc, branchId, token]);

    const fetchCountRecipes = async () => {
        const countRecipesResponse = await getCountRecipes({ token, status: 'active' });
        setRecipesCountFilteered(countRecipesResponse)
        setIsLoading(false);
        return countRecipesResponse
    }
    useSWR<ICountRecipes | null>('/dashboard/summary/countRecipes', fetchCountRecipes, {
        refreshInterval: 5000, // Actualiza cada 5 segundos (puedes ajustar el intervalo)
        revalidateOnFocus: true, // Vuelve a validar los datos cuando la página vuelve al foco
    });


    const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' });
    const currentMonthCapitalized =
        currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
    type MonthName =
        | "Enero" | "Febrero" | "Marzo" | "Abril"
        | "Mayo" | "Junio" | "Julio" | "Agosto"
        | "Septiembre" | "Octubre" | "Noviembre" | "Diciembre";
    const summaryData = [
        {
            title: 'Órdenes de Producción',
            value: monthlyOrdersCountsFiltered
                ? monthlyOrdersCountsFiltered[currentMonthCapitalized as MonthName]?.COMPLETED ?? 0
                : 0,
            icon: <FactoryIcon className="w-6 h-6" />,
            description: 'Realizadas este mes',
            linkUrl: '/productions/monthly',
        },
        {
            title: 'Recetas Registradas',
            value: recipesCountFilteered?.totalItems || 0,
            icon: <ListViewIcon className="w-6 h-6" />,
            description: 'Recetas activas en sistema',
            linkUrl: '/recipes',
        },
        {
            title: 'Sucursales Activas',
            value: 5,
            icon: <Store01Icon className="w-6 h-6" />,
            description: 'Con inventario disponible',
            linkUrl: '/branches',
        },
        {
            title: 'Mermas Reportadas',
            value: 12,
            icon: <Leaf01Icon className="w-6 h-6" />,
            description: 'Durante el mes actual',
            linkUrl: '/waste',
        },
    ]
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {summaryData.map((item, index) => (
                <DashboardCard
                    key={index}
                    title={item.title}
                    value={item.value}
                    icon={item.icon}
                    description={item.description}
                    // linkUrl={item.linkUrl}
                    isLoading={isLoading}
                />
            ))}
        </div>
    )
}
