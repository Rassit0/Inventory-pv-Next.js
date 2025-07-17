'use client';
import { Button, Card, Chip, Divider, Spinner, Tooltip } from '@heroui/react';
import React, { useState } from 'react';
import { ProductWasteFormModal, IParallelGroup, IProductionOrder, IProductionOrderDetail, updateOrderProduction } from '@/modules/admin/production';
import { toast } from 'sonner';
import { DetailsQuantityProductsRecipeModal } from '@/modules/admin/production-recipes';
import { DetailsQuantityProductsRecipeOrderModal } from '@/modules/admin/production-recipes/components/DetailsQuantityProductsRecipeOrderModal';
import { DetailsQuantityProductsWasteOrderModal } from '../DetailsQuantityProductsWasteOrderModal';

interface Props {
    token: string;
    order: IProductionOrder;
    parallelGroups: IParallelGroup[];
    editOrder: boolean;
}

export const OrderCard = ({ order, parallelGroups, token, editOrder }: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    // Truncate the UUID to the first 8 characters
    const truncatedId = order.id.slice(0, 8);

    // Group by parallelGroupId
    const groupedByParallel: Record<string, IProductionOrderDetail[]> = order.productionOrderDetails.reduce(
        (groups, detail) => {
            const groupKey = detail.parallelGroupId ?? 'no-parallel-group';
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(detail);
            return groups;
        },
        {} as Record<string, IProductionOrderDetail[]>
    );



    const handleUpdateStatus = async (orderId: string, status: 'COMPLETED' | 'CANCELED') => {
        console.log(status)
        setIsLoading(true);
        const formData = new FormData();
        formData.append('orderStatus', status);

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await updateOrderProduction({ formData, orderId, token });
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
    }

    return (
        <Card shadow="md" className="border-none rounded-xl p-6 w-full transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-xl truncate">Orden #{truncatedId}</p>
                    <p className="text-gray-500 text-sm">
                        {(order.deliveryDate ?? order.createdAt).toLocaleString()}
                    </p>
                </div>

                <Chip color={order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELED' ? 'danger' : 'warning'} variant="shadow">
                    {order.status === 'COMPLETED' ? 'Completado' : order.status === 'CANCELED' ? 'Cancelado' : 'Pendiente'}
                </Chip>
            </div>

            <Divider className="my-4" />

            <div className="grid grid-cols-4 gap-2 text-center font-semibold mb-2">
                <p></p>
                <p>Receta</p>
                <p>Cantidad</p>
                <p>Tiempo</p>
            </div>

            <ul className="space-y-4">
                {Object.entries(groupedByParallel).map(([groupKey, details]) => (
                    <li key={groupKey} className="space-y-4">
                        {groupKey !== 'no-parallel-group' && (
                            <div className="grid grid-cols-4 bg-primary-100 rounded-md p-3">
                                <p className="font-semibold text-lg text-center col-span-3">
                                    <Tooltip content="En paralelo">
                                        <span className="mr-1 cursor-help">🔄</span>
                                    </Tooltip>
                                    {/* Show Parallel Group Name or a fallback */}
                                    {`Grupo paralelo: ${parallelGroups.find(p => p.id === groupKey)?.name || 'Nombre desconocido'}`}
                                </p>
                                {groupKey !== 'no-parallel-group' && (
                                    <p className="text-center">{details[0].subTotalTime ?? 0} min.</p>
                                )}
                            </div>
                        )}

                        {details.length > 0 ? (
                            details.map((detail: IProductionOrderDetail) => (
                                <div key={detail.id} className="grid grid-cols-4 items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <DetailsQuantityProductsRecipeOrderModal recipe={detail.recipe} recipeCount={Number(detail.quantity)} />
                                    <p className="truncate">{detail.recipe?.name ?? 'Sin nombre'}</p>
                                    <p className="text-center">{detail.quantity}</p>

                                    {groupKey === 'no-parallel-group' && (
                                        <div className='flex items-center justify-center'>
                                            <p className="text-center">{detail.subTotalTime ?? 0} min.</p>
                                            {detail.isParallel && (<Tooltip content="En paralelo">
                                                <span className="mr-1 cursor-help">🔄</span>
                                            </Tooltip>)}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Sin detalles disponibles</p>
                        )}
                    </li>
                ))}

                {/* Mostrar el total de la orden al final */}
                <li className="space-y-4">
                    <div className="grid grid-cols-3 bg-warning-100 rounded-md p-3">
                        <p className="font-semibold text-lg text-center col-span-2">Total</p>
                        <p className="text-center">{order.totalTime} min.</p>
                    </div>
                </li>
            </ul>



            {(order.status === 'PENDING' && editOrder)
                ? (
                    <div className='flex justify-between items-center space-x-2'>
                        {/* <Button
                        fullWidth
                        color="danger"
                        onPress={() => handleUpdateStatus(order.id, 'CANCELED')}
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        className="mt-4"
                    >
                        Cancelar
                    </Button> */}
                        <ProductWasteFormModal
                            token={token}
                            order={order}
                            status='CANCELED'
                        />
                        <ProductWasteFormModal
                            token={token}
                            order={order}
                            status='COMPLETED'
                        />
                        {/* <Button
                        fullWidth
                        color="primary"
                        onPress={() => handleUpdateStatus(order.id, 'COMPLETED')}
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        className="mt-4"
                    >
                        Completar
                    </Button> */}
                    </div>
                )
                :
                order.productionWaste.length > 0 && (<DetailsQuantityProductsWasteOrderModal productionWaste={order.productionWaste} />)
            }
        </Card>
    );
};
