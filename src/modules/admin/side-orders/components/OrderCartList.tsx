import React, { useState } from 'react';
import { IOrderCart, useOrderCartStore } from '../stores/order-cart.store';
import Image from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { Add01Icon, Add02Icon, AlignBoxBottomLeftIcon, Delete01Icon, MinusSignIcon } from 'hugeicons-react';
import { Button, Checkbox, DatePicker, Divider, Select, SelectItem } from '@heroui/react';
import { IParallelGroup } from '../../production';
import { useUIStore } from '../../shared';
import { DetailsQuantityProductsRecipeModal } from '../../production-recipes';

type ImageErrors = {
    [key: string]: boolean;
};

interface Props {
    parallelGroups: IParallelGroup[];
}

export const OrderCartList = ({ parallelGroups: groups }: Props) => {
    const { orderCart, incrementQuantity, decrementQuantity, assignToParallelGroup, parallelGroups, setIsParallel } = useOrderCartStore();
    const [imageErrors, setImageErrors] = useState<ImageErrors>({});
    // const [parallelGroups, setParallelGroups] = useState<ParallelGroups>({});  // Estado para grupos paralelos
    const [currentGroup, setCurrentGroup] = useState<string>('');  // Grupo actual seleccionado
    const { branchId } = useUIStore();

    const handleImageError = (warehouseId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [warehouseId]: true,
        }));
    };

    // Función para agregar una receta al grupo paralelo seleccionado (desde el store)
    const addRecipeToParallelGroupHandler = (recipe: IOrderCart) => {
        assignToParallelGroup(recipe.recipe.id, currentGroup);  // Actualizar el estado global en lugar de local
    };

    const renderParallelGroups = () => {
        return Object.entries(parallelGroups).map(([groupId, recipes]) => {
            // Si el grupo no tiene recetas, no renderiza nada
            if (recipes.length === 0) return null;

            // Obtener el tiempo máximo de las recetas del grupo
            const maxPreparationTime = Math.max(...recipes.map(item => parseInt(item.recipe.preparationTime.toString()) || 0));

            return (
                <div key={groupId} className="mt-4">
                    <h4 className="font-semibold">Grupo: {groups.find(g => g.id === groupId)?.name}</h4>

                    {/* Mostrar el tiempo máximo de preparación del grupo */}
                    <div className='flex justify-end'>
                        <p className="text-sm">Sub Total: {maxPreparationTime} min.</p>
                    </div>

                    <ul className="flex flex-col gap-4">
                        {recipes.map((item) => (
                            <li key={item.recipe.id} className="flex justify-between items-center gap-2 hover:bg-primary-100 rounded-md p-1">
                                <input type="hidden" name={`subTotalTime[${groups.find(g => g.id === groupId)?.name}-${item.recipe.id}]`} value={maxPreparationTime} />
                                <input type="hidden" name="detailIds" value={`${groups.find(g => g.id === groupId)?.name}-${item.recipe.id}`} />
                                <input type="hidden" name={`recipeId[${groups.find(g => g.id === groupId)?.name}-${item.recipe.id}]`} value={item.recipe.id} />
                                <input type="hidden" name={`detailparallelGroupId[${groups.find(g => g.id === groupId)?.name}-${item.recipe.id}]`} value={groupId} />
                                <div className="max-w-20">
                                    <Image
                                        src={imageErrors[item.recipe.id] ? warning_error_image : item.recipe.imageUrl || no_image}
                                        alt="Vista previa"
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                        onError={() => handleImageError(item.recipe.id)}
                                    />
                                </div>

                                <div className="w-full">
                                    <div className='flex justify-between items-center'>
                                        <h5 className="font-semibold">{item.recipe.name}</h5>
                                        <DetailsQuantityProductsRecipeModal recipe={item.recipe} recipeCount={item.quantity} />
                                    </div>
                                    <p className="text-sm text-default-500">Tiempo: {item.recipe.preparationTime} minutos</p>

                                    <div className="w-full mt-3 flex items-center justify-between">
                                        <Button
                                            isIconOnly
                                            radius="full"
                                            variant="bordered"
                                            size="sm"
                                            color={item.quantity === 1 ? 'danger' : 'primary'}
                                            startContent={item.quantity === 1 ? <Delete01Icon size={12} /> : <MinusSignIcon size={12} />}
                                            onPress={() => decrementQuantity(item.recipe.id, groupId)}
                                        />
                                        <span>{item.quantity}</span>

                                        <input type="hidden" name={`detailQuantity[${groups.find(g => g.id === groupId)?.name}-${item.recipe.id}]`} value={item.quantity} />
                                        <Button
                                            isIconOnly
                                            radius="full"
                                            variant="bordered"
                                            size="sm"
                                            startContent={<Add01Icon size={12} />}
                                            onPress={() => incrementQuantity(item.recipe.id, groupId)}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                        <Divider className='my-4' />
                    </ul>
                </div>
            );
        });
    };


    return (
        <div className="w-full h-full max-h-min overflow-y-auto">
            {branchId && (<input type="hidden" name="orderBranchId" value={branchId} />)}
            <div className="mb-4">
                <Select
                    name="productUnitId"
                    label='Selecciona Grupo'
                    variant="bordered"
                    selectedKeys={[currentGroup]}
                    onChange={(e) => setCurrentGroup(e.target.value)}
                >
                    {
                        groups.map(group => (
                            <SelectItem key={group.id}>{group.name}</SelectItem>
                        ))
                    }
                </Select>
            </div>

            <ul className="flex flex-col gap-6 w-full">
                {orderCart.map((item) => (
                    <li key={item.recipe.id} className='flex flex-col space-y-1 hover:bg-primary-100 rounded-md'>
                        <input type="hidden" name='detailIds' value={item.recipe.id} />
                        <input type="hidden" name={`recipeId[${item.recipe.id}]`} value={item.recipe.id} />
                        <div className="flex justify-between items-center gap-2">
                            <div className="max-w-20">
                                <Image
                                    src={imageErrors[item.recipe.id] ? warning_error_image : item.recipe.imageUrl || no_image}
                                    alt="Vista previa"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                    onError={() => handleImageError(item.recipe.id)}
                                />
                            </div>

                            <div className="w-full">
                                <div className='flex justify-between items-center'>
                                    <h5 className="font-semibold">{item.recipe.name}</h5>
                                    <DetailsQuantityProductsRecipeModal recipe={item.recipe} recipeCount={item.quantity} />
                                </div>
                                <div className='flex justify-end'>
                                    <p className="text-sm">Sub Total: {item.totalTimeRecipe} min.</p>
                                    <input type="hidden" name={`subTotalTime[${item.recipe.id}]`} value={item.totalTimeRecipe} />
                                </div>
                                <p className="text-sm text-default-500">Tiempo: {item.recipe.preparationTime} min.</p>
                                <input type="hidden" name={`detailQuantity[${item.recipe.id}]`} value={item.quantity} />

                                <div className='space-y-2'>
                                    <div className="w-full mt-3 flex items-center justify-between">
                                        <Button
                                            isIconOnly
                                            radius="full"
                                            variant="bordered"
                                            size="sm"
                                            color={item.quantity === 1 ? 'danger' : 'primary'}
                                            startContent={item.quantity === 1 ? <Delete01Icon size={12} /> : <MinusSignIcon size={12} />}
                                            onPress={() => decrementQuantity(item.recipe.id)}
                                        />
                                        <span>{item.quantity}</span>
                                        <Button
                                            isIconOnly
                                            radius="full"
                                            variant="bordered"
                                            size="sm"
                                            startContent={<Add01Icon size={12} />}
                                            onPress={() => incrementQuantity(item.recipe.id)}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Botón para agregar receta al grupo paralelo */}
                        <div className='space-x-1'>

                            <Button
                                variant="solid"
                                color="primary"
                                size="sm"
                                startContent={<Add01Icon />}
                                onPress={() => addRecipeToParallelGroupHandler(item)}
                                isDisabled={parallelGroups[currentGroup]?.some((recipe) => recipe.recipe.id === item.recipe.id) || !groups.some(g => g.id === currentGroup)}  // Deshabilitar si ya está en el grupo
                            >
                                {groups.find(g => g.id === currentGroup)?.name}
                            </Button>

                            <Checkbox defaultSelected={item.isParallel} onValueChange={(value) => setIsParallel(item.recipe.id, value)} name={`isParallel[${item.recipe.id}]`} value={item.isParallel ? 'on' : 'off'}>En Paralelo</Checkbox>
                        </div>
                    </li>
                ))}
            </ul>

            <Divider className='my-4' />

            {/* Mostrar los grupos paralelos */}
            {renderParallelGroups()}
        </div>
    );
};
