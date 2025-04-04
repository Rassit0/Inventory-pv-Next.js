import React, { useState } from 'react'
import { useOrderCartStore } from '../stores/order-cart.store';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png'
import { Add01Icon, Delete01Icon, MinusSignIcon } from 'hugeicons-react';
import { Button } from '@heroui/react';

type ImageErrors = {
    [key: string]: boolean;
}

export const OrderCartList = () => {
    const { orderCart, incrementQuantity, decrementQuantity } = useOrderCartStore();
    const [imageErrors, setImageErrors] = useState<ImageErrors>({});

    const handleImageError = (warehouseId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [warehouseId]: true,
        }));
    };

    return (
        <ul className='flex flex-col gap-6 w-full h-full max-h-min overflow-y-auto'>
            {
                orderCart.map((item) => (
                    <li className='flex justify-between items-center gap-2' key={item.recipe.id}>
                        {/* IMAGEN */}
                        <div className="max-w-20">
                            <Image
                                src={imageErrors[item.recipe.id] ? warning_error_image : item.recipe.imageUrl || no_image}
                                alt="Vista previa"
                                width={80}  // Ajusta según el tamaño real de la imagen
                                height={80} // Ajusta según el tamaño real de la imagen
                                className="object-contain"
                                onError={() => handleImageError(item.recipe.id)}
                            />
                        </div>

                        {/* DETALLES */}
                        <div className="w-full">
                            <h5 className='font-semibold'>{item.recipe.name}</h5>
                            <p className='textsm'>Precio: {item.recipe.preparationTime}</p>

                            {/* BOTONES DE CANTIDAD */}
                            <div className='w-full mt-3 flex items-center justify-between'>

                                <Button
                                    isIconOnly
                                    radius='full'
                                    variant='bordered'
                                    size='sm'
                                    color={item.quantity === 1 ? 'danger' : 'primary'}
                                    startContent={item.quantity === 1 ? <Delete01Icon size={12} /> : <MinusSignIcon size={12} />}
                                    onPress={() => decrementQuantity(item.recipe.id)}
                                />

                                <span>{item.quantity}</span>

                                <Button
                                    isIconOnly
                                    radius='full'
                                    variant='bordered'
                                    size='sm'
                                    startContent={<Add01Icon size={12} />}
                                    onPress={() => incrementQuantity(item.recipe.id)}
                                />


                            </div>

                        </div>
                    </li>
                ))
            }
        </ul>
    )
}
