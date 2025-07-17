"use client";
import React, { useEffect, useState } from 'react';
import { ConfirmQuantitiesChecked, EDeliveryStatusDetail, EMovementStatus, IMovementDetail } from '@/modules/admin/inventory';
import { Input, Select, SelectItem, User, user, Button, Checkbox, CheckboxGroup, Chip, DatePicker, Divider } from '@heroui/react';
import no_image from '@/assets/no_image.png';
import Image from 'next/image';
import warning_error_image from '@/assets/warning_error.png';
import { IPersonsResponse } from '@/modules/admin/persons';
import { SelectSearchSupplierAndCreate } from '@/modules/admin/suppliers/components/select-search/SelectSearchSupplierAndCreate';
import { ISuppliersResponse } from '@/modules/admin/suppliers';
import { Add01Icon, Delete01Icon } from 'hugeicons-react';
import { sup } from 'framer-motion/client';
import { fromDate, getLocalTimeZone, now, toZoned, ZonedDateTime } from '@internationalized/date';

interface Props {
  token: string;
  details: IMovementDetail[];
  /**
   * Define cómo se debe ingresar la cantidad entregada:
   * - "suppliers": Solo cantidades por proveedor.
   * - "total": Solo cantidad total entregada.
   * - "both": Permitir ambos modos (checkbox para alternar).
   */
  deliveredQuantityMode?: "suppliers" | "total" | "both";
  defaultMovementStatus?: EMovementStatus;
  isRequiredSelectSupplier?: boolean;
  isRequiredQuantitySupplier?: boolean;
  isRequiredDeliveredQuantity?: boolean;
  supplierProps: {
    create?: {
      createSupplier: boolean;
      createContact: boolean;
      personsResponse: IPersonsResponse;
    };
    suppliersResponse: ISuppliersResponse;
  }
}

export const ConfirmQuantitiesFormTable = ({ details, token, supplierProps, defaultMovementStatus, isRequiredSelectSupplier = false, isRequiredQuantitySupplier, isRequiredDeliveredQuantity, deliveredQuantityMode = "both" }: Props) => {

  type ColorType = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

  const deliveryStatusDetailMap: Record<string, { name: string; color: ColorType }> = {
    PENDING: {
      name: 'Pendiente',
      color: 'warning',
    },
    COMPLETE: {
      name: 'Completo',
      color: 'success',
    },
    PARTIAL: {
      name: 'Parcial',
      color: 'primary',
    },
    NOT_DELIVERED: {
      name: 'No entregado',
      color: 'default',
    },
    OVER_DELIVERED: {
      name: 'En exceso',
      color: 'danger',
    }
  };



  // CONTROL DE LAS IMAGENES QUE TIENEN ERROR AL CARGAR
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  //Forms
  const [selectedStatus, setSelectedStatus] = useState<EMovementStatus | string>(defaultMovementStatus || EMovementStatus.Pending);
  const [deliveryStatusDetail, setDeliveryStatusDetail] = useState<Record<string, EDeliveryStatusDetail>>({})
  const [selectedAll, setSelectedAll] = useState(false);
  const [expectedQuantity, setExpectedQuantity] = useState<Record<string, string>>({});
  // const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  type SupplierQuantity = { id?: string; tempId?: string; supplierId: string; deliveredQuantity: string, deliveryDateProps: { showDeliveryDate: boolean, deliveryDate: ZonedDateTime | null } };
  const [supplierDeliveredQuantities, setSupplierDeliveredQuantities] = useState<Record<string, SupplierQuantity[]>>({});
  const [totalDeliveredQuantities, setTotalDeliveredQuantities] = useState<Record<string, number>>({});
  const [showSuppliers, setShowSuppliers] = useState<Record<string, boolean>>({});


  useEffect(() => {
    const initialData: Record<string, SupplierQuantity[]> = {};
    // const initialDataSelectItems: Record<string, boolean> = {};
    const initialDataShowSuppliers: Record<string, boolean> = {};
    const initialDataDeliveryStatusDetail: Record<string, EDeliveryStatusDetail> = {};
    const initialDataExpectedQuantity: Record<string, string> = {};

    details.forEach((detail) => {
      initialData[detail.id] = detail.detailSuppliers.length === 0
        // ? [{
        //   supplierId: '',
        //   deliveredQuantity: detail.totalDeliveredQuantity || '0',
        // }]
        ? []
        : detail.detailSuppliers.map((dSupplier) => {
          return {
            id: dSupplier.id,
            supplierId: dSupplier.supplierId || '',
            deliveredQuantity: dSupplier.deliveredQuantity || '0',
            deliveryDateProps: {
              showDeliveryDate: !!dSupplier.deliveryDate, // Mostrar fecha de entrega si existe
              deliveryDate: dSupplier.deliveryDate ? fromDate(dSupplier.deliveryDate, getLocalTimeZone()) : null, // Convertir la fecha a ZonedDateTime
            },
          }
        });
      // initialDataSelectItems[detail.id] = false;
      initialDataShowSuppliers[detail.id] = deliveredQuantityMode === "suppliers"; // Si checkedProviders es true, no mostrar proveedores
      initialDataDeliveryStatusDetail[detail.id] = EDeliveryStatusDetail.NOT_DELIVERED
      initialDataExpectedQuantity[detail.id] = detail.totalExpectedQuantity;
    });

    setDeliveryStatusDetail(initialDataDeliveryStatusDetail);
    setSupplierDeliveredQuantities(initialData);
    // setSelectedItems(initialDataSelectItems);
    setShowSuppliers(initialDataShowSuppliers);
    setExpectedQuantity(initialDataExpectedQuantity);

    // Limpia los errores de imagen cuando cambia la lista de personas
    setImageErrors({});
  }, [details]);

  useEffect(() => {
    const newTotals: Record<string, number> = {};
    const newDeliveryStatusDetail: Record<string, EDeliveryStatusDetail> = {};

    for (const [detailId, entries] of Object.entries(supplierDeliveredQuantities)) {
      if (entries.length === 0) {
        newTotals[detailId] = 0;
        newDeliveryStatusDetail[detailId] = EDeliveryStatusDetail.PENDING;
        continue;
      }

      const allEmpty = entries.every(entry => entry.deliveredQuantity === '');

      if (allEmpty) {
        newTotals[detailId] = 0;
        continue;
      }

      const total = entries.reduce((sum, entry) => {
        const quantity = parseFloat(entry.deliveredQuantity || '0');
        return sum + (isNaN(quantity) ? 0 : quantity);
      }, 0);

      const expected = parseFloat(expectedQuantity[detailId] || '0');

      newTotals[detailId] = total;

      if (total === 0) {
        newDeliveryStatusDetail[detailId] = EDeliveryStatusDetail.NOT_DELIVERED;
      } else if (total < expected) {
        newDeliveryStatusDetail[detailId] = EDeliveryStatusDetail.PARTIAL;
      } else if (total === expected) {
        newDeliveryStatusDetail[detailId] = EDeliveryStatusDetail.COMPLETE;
      } else if (total > expected) {
        newDeliveryStatusDetail[detailId] = EDeliveryStatusDetail.OVER_DELIVERED;
      }
    }

    setTotalDeliveredQuantities(newTotals);
    setDeliveryStatusDetail(newDeliveryStatusDetail);
  }, [supplierDeliveredQuantities, expectedQuantity]);


  const handleSupplierChange = (itemId: string, index: number, newSupplierId: string | null) => {
    setSupplierDeliveredQuantities(prev => {
      const updated = [...(prev[itemId] || [])];
      updated[index].supplierId = newSupplierId || '';
      return { ...prev, [itemId]: updated };
    });
  };

  const handleQuantityChange = (itemId: string, index: number, newQuantity: string) => {
    setSupplierDeliveredQuantities(prev => {
      const updated = [...(prev[itemId] || [])];
      updated[index].deliveredQuantity = newQuantity;
      return { ...prev, [itemId]: updated };
    });
  };

  const handleDeliveryDateToggle = (itemId: string, index: number, showDeliveryDate: boolean) => {
    setSupplierDeliveredQuantities(prev => {
      const updated = [...(prev[itemId] || [])];
      updated[index].deliveryDateProps.showDeliveryDate = showDeliveryDate;
      if (!showDeliveryDate) {
        updated[index].deliveryDateProps.deliveryDate = null; // Restablecer la fecha si se oculta
      }
      return { ...prev, [itemId]: updated };
    });
  };

  const handleDeliveryDateChange = (itemId: string, index: number, newDate: ZonedDateTime | null) => {
    setSupplierDeliveredQuantities(prev => {
      const updated = [...(prev[itemId] || [])];
      updated[index].deliveryDateProps.deliveryDate = newDate;
      return { ...prev, [itemId]: updated };
    });
  };

  const addSupplierEntry = (itemId: string) => {
    setSupplierDeliveredQuantities(prev => {
      const updated = [...(prev[itemId] || [])];
      updated.push({
        tempId: `${Date.now()}-${Math.random()}`,
        supplierId: '',
        deliveredQuantity: '',
        deliveryDateProps: {
          showDeliveryDate: false, // Por defecto no mostrar la fecha de entrega
          deliveryDate: null, // Inicialmente sin fecha
        }
      });
      return { ...prev, [itemId]: updated };
    });
  };

  const removeSupplierEntry = (itemId: string, index: number) => {
    setSupplierDeliveredQuantities(prev => {
      const updated = [...(prev[itemId] || [])];

      // Si solo hay una entrada, podrías decidir no permitir eliminarla (opcional)
      // if (updated.length <= 1) return prev;
      if (updated.length <= 0) return prev;

      updated.splice(index, 1); // Quitar el elemento en el índice

      return { ...prev, [itemId]: updated };
    });
  };

  /**
   * Manejador de errores de carga de imágenes.
   * @param detailId El ID del detalle cuya imagen no se pudo cargar.
   */
  const handleImageError = (detailId: string) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [detailId]: true,
    }));
  };

  // useEffect(() => {
  //   const allSelected = Object.values(selectedItems).every(val => val === true);
  //   setSelectedAll(allSelected);
  // }, [selectedItems]);

  return (
    <>
      {/* <Select
        isRequired
        name='statusTransaction'
        color='warning'
        variant='flat'
        selectedKeys={[selectedStatus]}
        onSelectionChange={(key) => setSelectedStatus(key.currentKey || '')}
        placeholder='Seleccione el estado'
        label='Estado'
      >
        <SelectItem key={'PENDING'}>Pendiente</SelectItem>
        <SelectItem key={'CANCELED'}>Cancelado</SelectItem>
        <SelectItem key={'COMPLETED'}>Completado</SelectItem>
      </Select> */}
      <div className="overflow-x-auto w-full rounded-xl overflow-hidden">
        <table className="table-auto w-full border-collapse">
          {/* Encabezado de la tabla */}
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left rounded-bl-xl">Producto</th>
              <th className="px-4 py-2 text-left">Cantidad esperada</th>
              <th className="px-4 py-2 text-left">Cantidad-Proveedor</th>
              <th className="px-4 py-2 text-left">Unidad</th>
              <th className="px-4 py-2 text-left rounded-br-xl">Estado de entrega</th>
              {/* <th className="px-4 py-2 text-center rounded-br-xl">
              <Checkbox isSelected={selectedAll} onValueChange={(value) => toggleAllCheckboxes(value)}></Checkbox>
            </th> */}
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          <tbody>
            {details.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 rounded-xl">

                {/* Producto */}
                <td className="px-4 py-2 rounded-tl-xl rounded-bl-xl">
                  <input type="hidden" name="detailIds" value={item.id} />
                  <input type="hidden" name={`productId-${item.id}`} value={item.productId || ''} />
                  <div className="flex gap-2 items-center">
                    <div className="min-w-10 w-[35px] h-[35px] relative">
                      <Image
                        fill
                        src={imageErrors[item.id] ? warning_error_image : item.product?.imageUrl || no_image}
                        alt="Vista previa"
                        sizes="35px"
                        className="rounded-full object-contain"
                        onError={() => handleImageError(item.id)}
                      />
                    </div>
                    <div className="flex-col min-w-0 flex">
                      <span className="text-small">{item.product?.name || 'Producto sin nombre'}</span>
                    </div>
                  </div>
                </td>

                {/* Cantidad esperada */}
                <td className="px-4 py-2">{item.totalExpectedQuantity}</td>

                {/* Componente para seleccionar, buscar y crear el proveedor de entrega del producto */}
                <td className="px-4 py-2">
                  {deliveredQuantityMode === 'both' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox
                        size="sm"
                        isSelected={showSuppliers[item.id] ?? true}
                        onValueChange={(checked) =>
                          setShowSuppliers((prev) => ({ ...prev, [item.id]: checked }))
                        }
                        className="mr-2"
                      >
                        <span className="text-xs">Proveedores</span>
                      </Checkbox>
                    </div>
                  )}

                  {showSuppliers[item.id] ? (
                    supplierDeliveredQuantities[item.id]?.length > 0 || !isRequiredQuantitySupplier ? (
                      supplierDeliveredQuantities[item.id]?.map((entry, index) => {
                        const uniqueId = entry.id ?? entry.tempId ?? index;
                        return (
                          <div key={uniqueId} className="flex items-center gap-2 mb-2">
                            <input type="hidden" name={`detailSuppliersIndex-${item.id}`} value={uniqueId} />
                            {entry.id && (
                              <input type="hidden" name={`detailSupplierId-${item.id}-${uniqueId}`} value={entry.id} />
                            )}
                            <div>
                              <Button
                                className="w-6 h-6 min-w-0 p-1"
                                isIconOnly
                                startContent={<Delete01Icon size={14} />}
                                color="danger"
                                radius="full"
                                onPress={() => removeSupplierEntry(item.id, index)}
                              />
                              <Input
                                isRequired={isRequiredDeliveredQuantity}
                                name={`deliveredQuantity-${item.id}-${uniqueId}`}
                                placeholder="Cantidad"
                                type="number"
                                min={0}
                                step="0.01"
                                className="w-[120px]"
                                variant="underlined"
                                value={entry.deliveredQuantity}
                                onChange={(e) => handleQuantityChange(item.id, index, e.target.value)}
                              />
                            </div>
                            <Divider className='h-9' orientation='vertical' />
                            <div className="min-w-52">
                              <SelectSearchSupplierAndCreate
                                // isRequired={isRequiredSelectSupplier}
                                isRequired
                                token={token}
                                name={`supplierId-${item.id}-${uniqueId}`}
                                itemsResponse={supplierProps.suppliersResponse}
                                defaultSelectedItemIds={entry.supplierId ? [entry.supplierId] : undefined}
                                onSelecteSingledItem={(value) =>
                                  handleSupplierChange(item.id, index, value ? value.id : null)
                                }
                                filterSuppliersByProductId={item.productId}
                                excludeSupplierIds={
                                  supplierDeliveredQuantities[item.id]
                                    ?.filter((d, i) => i !== index && d.supplierId !== '')
                                    .map((d) => d.supplierId)
                                }
                                create={supplierProps.create}
                              />
                            </div>
                            <Divider className='h-9' orientation='vertical' />
                            <div className='flex items-center'>
                              <Checkbox
                                isSelected={entry.deliveryDateProps.showDeliveryDate}
                                onValueChange={(value) => handleDeliveryDateToggle(item.id, index, value)}
                              >
                                {!entry.deliveryDateProps.showDeliveryDate && `Fecha de entrega`}
                              </Checkbox>
                              {entry.deliveryDateProps.showDeliveryDate && (
                                <DatePicker
                                  isRequired
                                  hideTimeZone
                                  name={`supplierDeliveryDate-${item.id}-${uniqueId}`}
                                  label="Fecha de entrega"
                                  variant="underlined"
                                  // defaultValue={parseDate(localDateString)}
                                  // defaultValue={now(getLocalTimeZone())}
                                  value={entry.deliveryDateProps.deliveryDate || now(getLocalTimeZone())}
                                  onChange={(date) => handleDeliveryDateChange(item.id, index, date)}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )
                      :
                      <span className="text-xs text-danger-500">
                        No hay cantidad-proveedores asignados.
                      </span>
                  ) : (
                    <Input
                      isRequired={isRequiredDeliveredQuantity}
                      name={`totalDeliveredQuantity-${item.id}`}
                      placeholder="Cantidad total entregada"
                      type="number"
                      min={0}
                      step="0.01"
                      // className="w-[120px] mb-2"
                      variant="underlined"
                      value={(totalDeliveredQuantities[item.id] ?? '').toString()}
                      onChange={(e) => {
                        // Si quieres permitir editar el total, aquí puedes manejar el cambio
                        // Por ejemplo, actualizar supplierDeliveredQuantities con un solo entry
                        const value = e.target.value;
                        setSupplierDeliveredQuantities((prev) => ({
                          ...prev,
                          [item.id]: [{ supplierId: '', deliveredQuantity: value, deliveryDateProps: { showDeliveryDate: false, deliveryDate: null } }],
                        }));
                      }}
                    />
                  )}

                  {showSuppliers[item.id] && (<Divider className='my-4' />)}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Total: {totalDeliveredQuantities[item.id] ?? 0}
                    </span>
                    {showSuppliers[item.id] && (
                      <Button
                        className="w-6 h-6 min-w-0 p-1"
                        radius="full"
                        color="primary"
                        variant="solid"
                        isIconOnly
                        startContent={<Add01Icon size={15} />}
                        onPress={() => addSupplierEntry(item.id)}
                      />
                    )}
                  </div>
                </td>

                <td className='px-4 py-2 text-default-500'>
                  {item.unit}
                </td>

                {/* Estado */}
                <td className="px-4 py-2 rounded-tr-xl rounded-br-xl">
                  <Chip color={deliveryStatusDetailMap[deliveryStatusDetail[item.id]]?.color}>{deliveryStatusDetailMap[deliveryStatusDetail[item.id]]?.name || 'Desconocido'}</Chip>
                </td>
                {/* Checkbox para seleccionar */}
                {/* <td className="px-4 py-2 text-center rounded-tr-xl">
                <Checkbox
                  isSelected={selectedItems[item.id] === true}
                  onValueChange={(value) => handleCheckboxChange(item.id, value)}
                />
              </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
