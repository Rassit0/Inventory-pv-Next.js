"use client"
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { IProduction } from '@/modules/admin/production';
import { useUIStore } from '../../shared';

interface Props {
    productions: IProduction[];
}

// Solo cargar el componente Table dinámicamente
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });

export const ProductionChart = ({ productions }: Props) => {


    const { branchId, handleChangeBranchId } = useUIStore();
    const [data, setData] = useState<{ name: string, value: number }[]>([]);

    useEffect(() => {
        if (!productions || productions.length === 0) return; // Evita cálculos innecesarios

        const monthCounts: Record<string, number> = {
            "Enero": 0, "Febrero": 0, "Marzo": 0, "Abril": 0,
            "Mayo": 0, "Junio": 0, "Julio": 0, "Agosto": 0,
            "Septiembre": 0, "Octubre": 0, "Noviembre": 0, "Diciembre": 0
        };

        productions.forEach(production => {
            const date = new Date(production.createdAt);
            let month = date.toLocaleDateString("es-ES", { month: "long" });

            // Capitalizar la primera letra para que coincida con los keys de `monthCounts`
            month = month.charAt(0).toUpperCase() + month.slice(1);

            if (monthCounts[month] !== undefined) {
                monthCounts[month]++;
            }
        });

        const chartData = Object.entries(monthCounts).map(([name, value]) => ({ name, value }))
        // console.log(chartData)
        setData(chartData);
    }, [productions]);

    return (
        <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" name='Ordenes completadas' />
        </LineChart>
    );
}
