import React, { FormEvent, useEffect, useState } from 'react'
import { ISimpleCategory } from '../interfaces/simple-category'
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';
import { updateCategory } from '../actions/update-category';
import { PencilEdit01Icon } from 'hugeicons-react';
import Image, { StaticImageData } from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';
import { ImageUploaderInput } from '../../shared';

interface Props {
  category: ISimpleCategory;
  categories: ISimpleCategory[];
}

export const UpdateCategoryModal = ({ category, categories }: Props) => {
  const [imageError, setImageError] = useState(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(category.imageUrl || null);
  // Form
  const [categoryName, setCategoryName] = useState(category.name);
  const [categoryDescription, setCategoryDescription] = useState(category.description);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(false);
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL);
    } else {
      setPreviewImage(null);
    }
  }

  // useEffect para resetear la previsualización al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setPreviewImage(category.imageUrl || null);
    }
  }, [isOpen, category.imageUrl]);

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

    // Si la imagen tiene archivos seleccionados, se agrega
    if (image.files.length > 0) {
      formData.append("image", image.files[0]);
    }

    // EJECUTAR SERVER ACTIONS PARA GUARDAR
    const { error, message, response } = await updateCategory(formData, category.id);
    if (error) {
      toast.warning("Ocurrió un error", {
        description: response ? response.message : message
      });

      setIsLoading(false);
      return;
    }

    //Si se guarda con éxito
    toast.success(message);
    onClose();
    setIsLoading(false);
  }

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        color='primary'
        variant='light'
        radius='full'
        startContent={<PencilEdit01Icon />}
      />

      <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} size='4xl'>
        <Form
          validationBehavior='native'
          // validationErrors={errors}
          onSubmit={handleSubmit}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Editar Categoría</ModalHeader>

                <ModalBody className='w-full grid lg:grid-cols-3'>
                  <div className='lg:col-span-1 pb-6 w-full'>
                    <h2 className="font-semibold">Imagen de presentación</h2>
                      <ImageUploaderInput name='image' imageDefault={previewImage || undefined} />
                  </div>
                  <div className='lg:col-span-2'>
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
                        defaultValue={category.description}
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
                        defaultSelectedKeys={category.parents ? category.parents.map(parent => parent.parent.id) : []} // Selecciona el valor por defecto
                        disabledKeys={[category.id]}
                      >
                        {
                          categories.map((categoryPatern => (
                            <SelectItem key={categoryPatern.id}>{categoryPatern.name}</SelectItem>
                          )))
                        }
                      </Select>
                    </div>
                  </div>

                </ModalBody>

                <ModalFooter>
                  <Button color='danger' variant='light' onPress={onClose}>Cancelar</Button>
                  <Button
                    type='submit'
                    color='primary'
                    isLoading={isLoading}
                    isDisabled={isLoading}
                  >
                    Actualizar
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
