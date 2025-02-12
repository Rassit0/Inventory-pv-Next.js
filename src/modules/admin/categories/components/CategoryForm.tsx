"use client"
import { Button, Form, Input, Select, SelectItem } from '@heroui/react'
import React, { FormEvent, useState } from 'react'
import { createCategory, ICategoriesResponse } from '@/modules/admin/categories'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import no_image from '@/assets/no_image.png'
import { ImageUploaderInput } from '../../shared'

export const CategoryForm = ({ categories }: ICategoriesResponse) => {
    // const [errors, setErrors] = useState({});
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    // Form
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

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

        router.push('/admin/products/categories')
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
            <div className='grid md:grid-cols-3 w-full'>
                <div className='md:col-span-1 pb-6'>
                    <h2 className="font-semibold">Imagen de presentación</h2>
                    <div>
                        <ImageUploaderInput name='image' imageDefault={previewImage || undefined} />
                    </div>
                </div>
                <div className='md:col-span-2'>
                    <h2 className="font-semibold">Datos generales</h2>
                    <div className='p-2'>
                        <Input
                            isRequired
                            name='categoryName'
                            label='Nombre'
                            placeholder='Agrega un nombre a la categoría'
                            variant='underlined'
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') setCategoryName(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                            }}
                            onBlur={() => {
                                setCategoryName(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                            }}
                        />

                        <Input
                            isRequired
                            name='categoryDescription'
                            label='Descripción'
                            placeholder='Agrega una descripción a la categoría'
                            variant='underlined'
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') setCategoryDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                            }}
                            onBlur={() => {
                                setCategoryDescription(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                            }}
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
                    </div>
                </div>

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
