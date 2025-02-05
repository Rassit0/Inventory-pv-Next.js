"use client"
import { Button, Form, Input, Select, SelectItem } from '@nextui-org/react'
import React, { FormEvent, useState } from 'react'
import { createCategory, ICategoriesResponse } from '@/modules/admin/categories'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import no_image from '@/assets/no_image.png'

export const CategoryForm = ({ categories }: ICategoriesResponse) => {
    // const [errors, setErrors] = useState({});
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setPreviewImage(fileURL);
        } else {
            setPreviewImage(null);
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        const { categoryName, image, categoryDescription, categoryPaternId } = e.target as HTMLFormElement;

        const formData = new FormData();
        formData.append("name", categoryName.value);
        formData.append("description", categoryDescription.value);

        // Manejar el select múltiple
        const selectedParentIds = Array.from(categoryPaternId.selectedOptions).map(
            (option) => (option as HTMLOptionElement).value // Aseguramos que 'option' es de tipo HTMLOptionElement
        );
        selectedParentIds.forEach(id => {
            formData.append("parentIds", id); // Añadir cada valor seleccionado
        });
        console.log("adsf" + selectedParentIds)

        // Si la imagen tiene archivos seleccionados, se agrega
        if (image.files.length > 0) {
            formData.append("image", image.files[0]);
        }

        // EJECUTAR SERVER ACTIONS PARA GUARDAR
        const { error, message, response } = await createCategory(formData);
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

        //Si se guarda con éxito
        toast.success(message);
        setIsLoading(false);

        router.push('/admin/categories')
        return;
    }

    return (
        <Form
            validationBehavior='native'
            // validationErrors={errors}
            className='bg-white px-6 pt-8 pb-12 border border-gray-300 rounded space-y-6'
            onSubmit={handleSubmit}
        >
            <h2 className='text-2xl font-semibold'>Formulario</h2>

            <Input
                isRequired
                name='categoryName'
                label='Nombre'
                placeholder='Agrega un nombre a la categoría'
                variant='underlined'
            />

            <Input
                isRequired
                name='categoryDescription'
                label='Descripción'
                placeholder='Agrega una descripción a la categoría'
                variant='underlined'
            />

            <Select
                name='categoryPaternId'
                label='Categorías Padre'
                placeholder='Selecciona categorías padre'
                variant='underlined'
                selectionMode='multiple'
            >
                {
                    categories.map((categoryPatern => (
                        <SelectItem key={categoryPatern.id}>{categoryPatern.name}</SelectItem>
                    )))
                }
            </Select>

            <Input
                name='image'
                label="Imagen"
                placeholder='Selecciana una imagen'
                type="file"
                variant='underlined'
                onChange={handleImageChange}
            />

            {/* Previsualización de la imagen */}
                <div className='relative mt-4 w-full h-[200px] flex items-center justify-center'>
                    <Image
                        src={previewImage || no_image}
                        alt='Vista previa'
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className='rounded-lg object-contain'
                    />
                </div>

            <Button
                type='submit'
                color='primary'
                className='block'
                isLoading={isLoading}
                isDisabled={isLoading}
            >
                Guardar Categoría
            </Button>
        </Form>
    )
}
