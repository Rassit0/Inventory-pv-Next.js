"use client"
import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Popover, PopoverContent, PopoverTrigger, PressEvent, useDisclosure } from '@heroui/react'
import { ChefHatIcon, Delete02Icon, MoreVerticalIcon, PencilEdit01Icon, PencilEdit02Icon, ViewIcon } from 'hugeicons-react'
import Image from 'next/image'
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png'
import React, { useState } from 'react'
import { DeleteRecipeModal, IRecipe, UpdateRecipeFormModal } from '@/modules/admin/production-recipes'
import { useOrderCartStore } from '@/modules/admin/side-orders';
import { IProductsResponse } from '@/modules/admin/products';
import { IBranch } from '@/modules/admin/branches';
import { IWarehouse } from '@/modules/admin/warehouses';
import { useRouter } from 'next/navigation';

interface Props {
    token: string;
    writeProduction: boolean;
    editRecipe: boolean;
    deleteRecipe: boolean;
    recipe: IRecipe;
    productsResponse: IProductsResponse
    branches: IBranch[];
    warehouses: IWarehouse[];
}
type ImageErrors = {
    [key: string]: boolean;
}
export const RecipeCard = ({ token, writeProduction, deleteRecipe, editRecipe, recipe, branches, productsResponse, warehouses }: Props) => {
    const [imageErrors, setImageErrors] = useState<ImageErrors>({});
    const [isOpenPopover, setIsOpenPopover] = useState(false);
    const [hiddenPopover, setHiddenOpenPopover] = useState(false);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const handleOpenPopover = () => {
        console.log('ebntrooo')
        // setIsOpenPopover(!isOpenPopover)
    }

    const { addRecipeToOrderCart } = useOrderCartStore();

    const router = useRouter();


    const handleImageError = (warehouseId: string) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [warehouseId]: true,
        }));
    };
    return (
        /* eslint-disable no-console */
        <>
            <Card
                // isPressable
                shadow="md"
                onPress={() => console.log("recipe pressed")}
                className='flex-row'
            >
                <CardBody className="overflow-visible p-0 flex justify-center items-center">
                    <div className='min-w-10 flex justify-center items-center'>
                        {/* <Image
                        src={imageErrors[recipe.id] ? warning_error_image : recipe.imageUrl || no_image}
                        alt='Vista previa'
                        // sizes="35px"
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        className='object-contain'
                        onError={() => handleImageError(recipe.id)}
                    /> */}
                        <Image
                            src={imageErrors[recipe.id] ? warning_error_image : recipe.imageUrl || no_image}
                            alt="Vista previa"
                            width={200} // Ajusta el tamaño según lo que necesites
                            height={200} // Ajusta el tamaño según lo que necesites
                            className="object-contain"
                        />

                    </div>
                    {/* <div className="relative flex justify-end recipes-center gap-2">
                </div> */}
                </CardBody>
                <CardFooter className="h-full text-small flex-col justify-between">
                    <div>
                        <div className='flex flex-row'>
                            <b>{recipe.name}</b>
                            {/* Dropdown de los tres puntos en la esquina superior derecha */}
                            <div className=" top-2 right-2">

                                <Popover showArrow placement="bottom" hidden={hiddenPopover} isOpen={isOpen} onOpenChange={onOpenChange}>
                                    <PopoverTrigger>
                                        <Button isIconOnly radius="full" size="sm" variant="light" onClick={onOpen}>
                                            <MoreVerticalIcon className="text-default-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-1">
                                        <Button key="view"
                                            startContent={<ViewIcon />}
                                            color='primary'
                                            variant='light'
                                            className='w-full flex justify-start'
                                            onPress={() => router.push(`/admin/production/recipes/view/${recipe.slug}`)}>
                                            Ver
                                        </Button>

                                        {editRecipe ? (
                                            // <DropdownItem key="edit" closeOnSelect={isOpen} onPress={onOpen} startContent={<PencilEdit01Icon/>}>
                                            <Button key="edit"
                                                startContent={<PencilEdit01Icon />}
                                                color='warning'
                                                variant='light'
                                                className='w-full flex justify-start'
                                                onPress={() => router.push(`/admin/production/recipes/edit/${recipe.id}`)}>
                                                {/* Editar */}
                                                Editar
                                            </Button>
                                        ) : null}

                                        {deleteRecipe ? (
                                            <DeleteRecipeModal recipeId={recipe.id} recipeName={recipe.name} token={token}
                                                onPress={() => setHiddenOpenPopover(true)}
                                                onCloseModal={() => {
                                                    onClose();
                                                    setTimeout(() => {
                                                        setHiddenOpenPopover(false);
                                                    }, 100); // 1000 milisegundos = 1 segundo
                                                }}
                                            />
                                        ) : null}
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <p>
                            <span className='font-semibold'>Tiempo: </span>
                            <span className='text-default-500'>{recipe.preparationTime} min.</span>
                        </p>
                    </div>
                    {writeProduction && (<div className='w-full flex flex-row'>
                        <Button
                            onPress={() => addRecipeToOrderCart(recipe)}
                            isIconOnly
                            startContent={<ChefHatIcon />}
                            className='w-full'
                            // variant='flat'
                            color='primary'
                        />
                    </div>)}
                </CardFooter>
            </Card>
        </>
    )
}
