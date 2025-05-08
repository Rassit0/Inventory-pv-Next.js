"use client";
import React, { useEffect, useState } from 'react';
import { ConfirmQuantitiesChecked, EDeliveryStatusDetail, IMovementDetail } from '@/modules/admin/inventory';
import { Input, Select, SelectItem, User, user, Button, Checkbox, CheckboxGroup, Chip } from '@heroui/react';
import no_image from '@/assets/no_image.png';
import Image from 'next/image';
import warning_error_image from '@/assets/warning_error.png';

interface Props {
  details: IMovementDetail[];
}

export const ConfirmQuantities = ({ details }: Props) => {
  // CONTROL DE LAS IMAGENES QUE TIENEN ERROR AL CARGAR
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  useEffect(() => {
    // Limpia los errores de imagen cuando cambia la lista de personas
    setImageErrors({});
  }, [details]);

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

  const [selected, setSelected] = useState<string[]>([]);

  const handleChangeChecketAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelected(['all', ...details.map((item) => item.id)]);
    } else {
      setSelected([]); // Deseleccionar todos los elementos
    }
  };

  // Función para manejar el cambio de selección de un producto individual
  const handleIndividualSelect = (detailId: string, isSelected: boolean) => {
    if (!isSelected) {
      setSelected(details.map((item) => item.id).filter((d) => d !== detailId));
    }
  };

  return (
    <CheckboxGroup
      value={selected}
      onValueChange={(value: string[]) => setSelected(value)}
    >
      <div className="overflow-x-auto w-full rounded-xl overflow-hidden">
        <table className="table-auto w-full border-collapse">
          {/* Encabezado de la tabla */}
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left rounded-bl-xl">Estado</th>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Cantidad esperada</th>
              <th className="px-4 py-2 text-left">Cantidad entregada</th>
              <th className="px-4 py-2 text-center rounded-br-xl">
                <Checkbox value="all" onValueChange={(value) => handleChangeChecketAll(value)}></Checkbox>
              </th>
            </tr>
          </thead>
  
          {/* Cuerpo de la tabla */}
          <tbody>
            {details.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 rounded-xl">
                {/* Estado */}
                <td className="px-4 py-2 rounded-tl-xl">
                  <Chip color="success">Completo</Chip>
                </td>
  
                {/* Producto */}
                <td className="px-4 py-2">
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
                <td className="px-4 py-2">{item.expectedQuantity}</td>
  
                {/* Input para la cantidad entregada */}
                <td className="px-4 py-2">
                  <Input
                    name={`deliveredQuantity-${item.id}`}
                    placeholder="Ingrese la cantidad entregada"
                    type="number"
                    min={0}
                    className="w-full"
                    variant="underlined"
                    isDisabled={selected.includes(item.id) ? true : undefined}
                    value={item.expectedQuantity}
                  />
                </td>
  
                {/* Checkbox para seleccionar */}
                <td className="px-4 py-2 text-center rounded-tr-xl">
                  <Checkbox
                    value={item.id}
                    onValueChange={(value) => handleIndividualSelect(item.id, value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CheckboxGroup>
  );
};
