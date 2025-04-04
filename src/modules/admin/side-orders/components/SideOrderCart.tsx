import { Button, DatePicker, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Form, Input } from '@heroui/react'
import { Cancel01Icon } from 'hugeicons-react';
import React, { FormEvent, useState } from 'react'
import { useOrderCartStore } from '../stores/order-cart.store';
import { OrderCartList } from '@/modules/admin/side-orders';
import { toast } from 'sonner';
import { useUIStore } from '../../shared';
import { createOrderProduction, IParallelGroup } from '@/modules/admin/production';
import { parseAbsolute, ZonedDateTime } from '@internationalized/date';
import { useRouter } from 'next/navigation';

interface Props {
    token: string;
    isOpen: boolean;  // Estado de apertura del Drawer
    onOpenChange: (isOpen: boolean) => void; // Función para cambiar el estado
    parallelGroups: IParallelGroup[];
}

export const SideOrderCart = ({ isOpen, onOpenChange, parallelGroups, token }: Props) => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const { totalTime, orderCart, cleanOrderCart, parallelGroups: groups } = useOrderCartStore();
    const { branchId } = useUIStore();

    // Estado para manejar el valor del DatePicker

    const [deliveryDate, setDeliveryDate] = useState<ZonedDateTime | null>(parseAbsolute(((new Date())).toISOString(), 'America/La_Paz'));    

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // setIsLoading(true);
        const { orderBranchId } = e.target as HTMLFormElement;
        if (!orderBranchId) {
            toast.error("Debe seleccionar la sucursal");
            return;
        }

        if (orderCart.length === 0 && Object.keys(groups).length === 0) {
            toast.error("Debe agregar al menos una receta.");
            return;
        }

        const formData = new FormData(e.currentTarget);
        formData.append("orderStatus", 'PENDING');
        const dataArray: any[] = [];
        formData.forEach((value, key) => {
            dataArray.push({ key, value });
        });

        // Convertir el array a JSON y mostrarlo
        console.log(JSON.stringify(dataArray, null, 2));
        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await createOrderProduction({ formData, token: token || '' });
        if (error) {
            if (response && Array.isArray(response.message)) {
                // Itera sobre cada mensaje en response.message y muestra un toast para cada uno
                response.message.forEach((msg: string) => {  // Aquí se define el tipo de 'msg'
                    toast.warning("Ocurrió un error", {
                        description: msg
                    });
                });
            } else {
                // Si no es un arreglo, muestra un solo toast con el mensaje
                toast.warning("Ocurrió un error", {
                    description: response ? response.message : message
                });
            }

            setIsLoading(false);
            return;
        }

        // Si se guarda con éxito
        toast.success(message);
        setIsLoading(false);

        cleanOrderCart();
        setDeliveryDate(parseAbsolute((new Date()).toISOString(), 'America/La_Paz'));
        router.push('/admin/production/orders');

        return;
    }
    return (
        <Drawer isOpen={isOpen} radius='none' size='sm' onOpenChange={onOpenChange}>
            <Form onSubmit={handleSubmit}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 shadow-sm">Confirmar Ordenes</DrawerHeader>
                            <DrawerBody>
                                {/* <Input
                                size='sm'
                                placeholder='Nombre del cliente'
                                name='client'
                                className='my-4'
                            /> */}

                                {/* LISTADO DE CARRITO */}
                                <OrderCartList parallelGroups={parallelGroups} />

                            </DrawerBody>
                            <DrawerFooter className='flex-col border-t'>
                                <p className='flex justify-between'>
                                    <span className='text-lg font-bold text-gray-500'>Tiempo:</span>
                                    <span className='text-primary font-bold'>{totalTime} min.</span>
                                    <input type="hidden" name="orderTotalTime" value={totalTime} />
                                </p>
                                <DatePicker
                                    isRequired
                                    name="orderDeliveryDate"
                                    label="Fecha de entrega"
                                    variant="underlined"
                                    value={deliveryDate}  // Controla el valor del DatePicker
                                    onChange={setDeliveryDate}  // Actualiza el valor al cambiar
                                />

                                <Button type='submit' color="primary">
                                    Ordenar
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Form>
        </Drawer>

    )
}
