"use client"
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Button, Checkbox, CheckboxGroup, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@heroui/react'
import { updateHandlingUnit } from '@/modules/admin/handling-units';
import { toast } from 'sonner';
import { PencilEdit01Icon } from 'hugeicons-react';
import { IProductionOrder, IRecipeItemProduct, updateOrderProduction } from '@/modules/admin/production';
import no_image from '@/assets/no_image.png';
import Image from 'next/image';
import warning_error_image from '@/assets/warning_error.png';

interface Props {
    token: string;
    order: IProductionOrder;
    status: 'CANCELED' | 'COMPLETED';
}

export const ProductWasteFormModal = ({ token, order, status }: Props) => {

    const formRef = useRef<HTMLFormElement>(null);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    //Form
    const reasonColorMap: Record<string, "danger" | "default" | "primary" | "secondary" | "success" | "warning"> = {
        CANCELED: "danger",
        DAMAGED: "warning",
        EXPIRED: "warning",
        RETURNED: "secondary",
        OVERPRODUCTION: "primary",
        OTHER: "default",
    };
    const [selectedReason, setSelectedReason] = useState<Record<string, string>>({});
    const handleReasonChange = (productId: string, reason: string) => {
        setSelectedReason(prev => ({
            ...prev,
            [productId]: reason,
        }));
    };
    const [products, setProducts] = useState<IRecipeItemProduct[]>(() => {
        const allProducts = order.productionOrderDetails
            .flatMap(detail => detail.recipe?.items?.map(item => item.product) || []);
        // Elimina duplicados por id
        const uniqueProducts = Array.from(
            new Map(allProducts.map(p => [p.id, p])).values()
        );
        return uniqueProducts;
    });
    const [checkProductIds, setCheckProductIds] = useState<string[]>([]);

    // Cuando el usuario selecciona/deselecciona un checkbox
    const handleCheckProductIds = (values: string[]) => {
        const allProductIds = products.map(p => p.id);
        const valuesWithoutAll = values.filter(v => v !== "all");

        // Si selecciona "all" y antes no estaba, selecciona todos
        if (values.includes("all") && !checkProductIds.includes("all")) {
            setCheckProductIds(["all", ...allProductIds]);
            return;
        }

        // Si antes estaba "all" y ahora no, quita "all" y deja los seleccionados
        if (checkProductIds.includes("all") && !values.includes("all")) {
            setCheckProductIds([]);
            return;
        }

        // Si selecciona todos manualmente, agrega "all"
        if (valuesWithoutAll.length === products.length) {
            setCheckProductIds(["all", ...allProductIds]);
            return;
        }

        // En cualquier otro caso, solo actualiza normalmente
        setCheckProductIds(valuesWithoutAll);
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        setIsLoading(true);
        // const formData = new FormData(e.currentTarget);
        const formData = new FormData(formRef.current);
        formData.append('orderStatus', status);

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await updateOrderProduction({ formData, orderId: order.id, token });

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        // const { error, message, response } = await updateHandlingUnit({ formData, unitId: unit.id, token });
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

        // Se se guarda con éxito
        toast.success(message);
        setIsLoading(false);

        onClose();
    }

    return (
        <>
            {/* <Button
                onPress={onOpen}
                isIconOnly
                color='primary'
                variant='light'
                radius='full'
                startContent={<PencilEdit01Icon />}
            /> */}
            <Button
                fullWidth
                color={status === 'COMPLETED' ? 'primary' : 'danger'}
                onPress={onOpen}
                className="mt-4"
            >
                {status === 'COMPLETED' ? 'Completar' : 'Cancelar'}
            </Button>
            <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='outside' placement='top'
                size='5xl'
            >
                <Form
                    ref={formRef}
                    validationBehavior='native'
                    onSubmit={handleSubmit}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>¿Estás seguro que deseas {status === 'COMPLETED' ? 'completar' : 'cancelar'} la orden?</ModalHeader>

                                <ModalBody className='w-full'>
                                    <div className="overflow-x-auto w-full rounded-xl overflow-hidden">
                                        <h2>Indique si hubo desperdicios</h2>
                                        <CheckboxGroup
                                            color="warning"
                                            // label="Select cities"
                                            value={checkProductIds}
                                            onValueChange={handleCheckProductIds}
                                        >
                                            <table className="table-auto w-full border-collapse">
                                                {/* Encabezado de la tabla */}
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className='px-4 py-2 text-left rounded-tl-xl rounded-bl-xl'>
                                                            <div className='flex items-center justify-center'>
                                                                <Checkbox value="all"></Checkbox>
                                                            </div>
                                                        </th>
                                                        <th className="px-4 py-2 text-left">Producto</th>
                                                        {/* <th className="px-4 py-2 text-left">Cantidad esperada</th> */}
                                                        <th className="px-4 py-2 text-left">Cantidad</th>
                                                        <th className="px-4 py-2 text-left">Unidad</th>
                                                        <th className="px-4 py-2 text-left rounded-tr-xl rounded-br-xl">Estado de entrega</th>
                                                        {/* <th className="px-4 py-2 text-center rounded-br-xl">
              <Checkbox isSelected={selectedAll} onValueChange={(value) => toggleAllCheckboxes(value)}></Checkbox>
            </th> */}
                                                    </tr>
                                                </thead>

                                                {/* Cuerpo de la tabla */}
                                                <tbody>
                                                    {products.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50 rounded-xl">
                                                            <td className='px-4 py-2 rounded-tl-xl rounded-bl-xl'>
                                                                <div className='flex items-center justify-center'>
                                                                    <Checkbox value={item.id}></Checkbox>
                                                                </div>
                                                            </td>
                                                            {/* Producto */}
                                                            <td className="px-4 py-2">
                                                                {/* <input type="hidden" name="detailIds" value={item.id} /> */}
                                                                <input type="hidden"
                                                                    disabled={!checkProductIds.includes(item.id)}
                                                                    name={`productIds`} value={item.id} />
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="min-w-10 w-[35px] h-[35px] relative">
                                                                        <Image
                                                                            fill
                                                                            src={item.imageUrl || no_image}
                                                                            alt="Vista previa"
                                                                            sizes="35px"
                                                                            className="rounded-full object-contain"
                                                                        // onError={() => handleImageError(item.id)}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-col min-w-0 flex">
                                                                        <span className={`text-small ${!checkProductIds.includes(item.id) ? 'line-through' : ''}`}>{item.name || 'Producto sin nombre'}</span>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Cantidad esperada */}
                                                            {/* <td className="px-4 py-2">{item.totalExpectedQuantity}</td> */}

                                                            {/* Componente para seleccionar, buscar y crear el proveedor de entrega del producto */}
                                                            <td className="px-4 py-2">
                                                                <Input
                                                                    isRequired={checkProductIds.includes(item.id)}
                                                                    name={`wasteQuantity-${item.id}`}
                                                                    placeholder="Cantidad total entregada"
                                                                    type="number"
                                                                    min={0}
                                                                    // className="w-[120px] mb-2"
                                                                    variant="underlined"
                                                                    isDisabled={!checkProductIds.includes(item.id)}
                                                                    endContent={item.unit.abbreviation}
                                                                // value={(totalDeliveredQuantities[item.id] ?? '').toString()}
                                                                // onChange={(e) => {
                                                                //     // Si quieres permitir editar el total, aquí puedes manejar el cambio
                                                                //     // Por ejemplo, actualizar supplierDeliveredQuantities con un solo entry
                                                                //     const value = e.target.value;
                                                                //     setSupplierDeliveredQuantities((prev) => ({
                                                                //         ...prev,
                                                                //         [item.id]: [{ supplierId: '', deliveredQuantity: value }],
                                                                //     }));
                                                                // }}
                                                                />
                                                            </td>

                                                            <td className={`px-4 py-2 text-default-500 ${!checkProductIds.includes(item.id) ? 'line-through' : ''}`}>
                                                                {item.unit.name}
                                                            </td>

                                                            {/* Estado */}
                                                            <td className="px-4 py-2 rounded-tr-xl rounded-br-xl">
                                                                {/* <Chip color={deliveryStatusDetailMap[deliveryStatusDetail[item.id]]?.color}>{deliveryStatusDetailMap[deliveryStatusDetail[item.id]]?.name || 'Desconocido'}</Chip> */}
                                                                <Select
                                                                    isRequired={checkProductIds.includes(item.id)}
                                                                    name={`wasteReason-${item.id}`}
                                                                    label='Seleccione motivo'
                                                                    variant='flat'
                                                                    color={reasonColorMap[selectedReason[item.id]] || "default"}
                                                                    onSelectionChange={(key) => handleReasonChange(item.id, key.currentKey || '')}
                                                                    isDisabled={!checkProductIds.includes(item.id)}
                                                                >
                                                                    <SelectItem key={"CANCELED"}>Orden cancelada</SelectItem>
                                                                    <SelectItem key={"DAMAGED"}>Producto dañado</SelectItem>
                                                                    <SelectItem key={"EXPIRED"}>Producto vencido</SelectItem>
                                                                    <SelectItem key={"RETURNED"}>Producto devuelto</SelectItem>
                                                                    <SelectItem key={"OVERPRODUCTION"}>Sobreproducción</SelectItem>
                                                                    <SelectItem key={"OTHER"}>Otro motivo</SelectItem>
                                                                </Select>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </CheckboxGroup>
                                    </div>
                                </ModalBody>

                                <ModalFooter>
                                    <Button color='danger' variant='light' onPress={onClose}>
                                        Cerrar
                                    </Button>
                                    <Button
                                        type='submit'
                                        color={status === 'COMPLETED' ? 'primary' : 'danger'}
                                        isLoading={isLoading}
                                        isDisabled={isLoading}
                                    >
                                        {status === 'COMPLETED' ? 'Completar' : 'Cancelar'}
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Form>
            </Modal>
        </>
    )
}
