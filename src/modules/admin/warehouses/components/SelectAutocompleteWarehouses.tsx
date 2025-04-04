"use client"
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { Add01Icon, Search01Icon } from 'hugeicons-react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { IWarehouse } from '@/modules/admin/warehouses';

interface Props {
    warehouses: IWarehouse[];
    name?: string;
    isRequired?: boolean;
    label?: string;
    selectedWarehouse?: IWarehouse | null;
    setSelectedWarehouse?: (branch: IWarehouse | null) => void;
}

export const SelectAutocompleteWarehouses = ({ label, warehouses, name, isRequired = false, selectedWarehouse, setSelectedWarehouse }: Props) => {
    // CONTROL DE LAS IMAGENES QUE TIENEN ERROR AL CARGAR
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    useEffect(() => {
        setImageErrors({})
    }, [warehouses])

    const handleImageError = (warehouseId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [warehouseId]: true,
        }));
    };
    return (
        <>
            <input type="hidden" name={name} value={selectedWarehouse?.id || ''} />
            <Autocomplete
                // name={name}
                isRequired={isRequired}
                label={label}
                labelPlacement='outside'
                size='sm'
                aria-label="Select an warehouse"
                classNames={{
                    base: "max-w-full",
                    listboxWrapper: "max-h-[320px]",
                    selectorButton: "text-default-500",
                    endContentWrapper: "w-10",
                    clearButton: "ml-[-15px]"
                }}
                defaultItems={warehouses}
                inputProps={{
                    classNames: {
                        input: "ml-0",
                        inputWrapper: "h-[28px]",
                    },
                }}
                listboxProps={{
                    hideSelectedIcon: true,
                    itemClasses: {
                        base: [
                            "rounded-medium",
                            "text-default-500",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "dark:data-[hover=true]:bg-default-50",
                            "data-[pressed=true]:opacity-70",
                            "data-[hover=true]:bg-default-200",
                            "data-[selectable=true]:focus:bg-default-100",
                            "data-[focus-visible=true]:ring-default-500",
                        ],
                    },
                }}
                placeholder="Almacén"
                popoverProps={{
                    offset: 10,
                    classNames: {
                        base: "rounded-large",
                        content: "p-1 border-small border-default-100 bg-background",
                    },
                }}
                radius="full"
                startContent={<Search01Icon className="text-default-400" size={20} strokeWidth={2.5} />}
                variant="bordered"
                selectedKey={selectedWarehouse?.id} // Muestra la sucursal seleccionada
                onSelectionChange={(key) => {
                    const selected = warehouses.find(warehouse => warehouse.id === key);
                    if (setSelectedWarehouse) setSelectedWarehouse(selected || null);
                }}
            >
                {(item) => (
                    <AutocompleteItem key={item.id} textValue={item.name}>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center cursor-pointer">
                                <div className='min-w-10'>
                                    <Image
                                        src={imageErrors[item.id] ? warning_error_image : item.imageUrl || no_image}
                                        alt='Vista previa'
                                        sizes="35px"
                                        // style={{
                                        //     width: '100%',
                                        //     height: 'auto',
                                        // }}
                                        width={35}
                                        height={35}
                                        className='rounded-lg object-contain'
                                        onError={() => handleImageError(item.id)}
                                    />
                                </div>
                                <div className="flex-col min-w-0 flex">
                                    <span className="text-small">{item?.name}</span>
                                    <span className="text-tiny text-default-400 truncate">{item?.location}</span>
                                </div>
                            </div>
                            <Button
                                className="border-small mr-0.5 font-medium shadow-small"
                                radius="full"
                                size="sm"
                                variant="bordered"
                                isIconOnly
                                startContent={<Add01Icon />}
                            />
                        </div>
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </>
    )
}
