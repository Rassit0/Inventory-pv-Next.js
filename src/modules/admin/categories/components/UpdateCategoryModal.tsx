import React, { FormEvent, useEffect, useState } from 'react'
import { ISimpleCategory } from '../interfaces/simple-category'
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';
import { updateCategory } from '../actions/update-category';
import { PencilEdit01Icon } from 'hugeicons-react';
import Image, { StaticImageData } from 'next/image';
import no_image from '@/assets/no_image.png';
import warning_error_image from '@/assets/warning_error.png';

interface Props {
  category: ISimpleCategory;
  categories: ISimpleCategory[];
}

export const UpdateCategoryModal = ({ category, categories }: Props) => {
  const [imageError, setImageError] = useState(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(category.imageUrl || null);

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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form
              validationBehavior='native'
              // validationErrors={errors}
              onSubmit={handleSubmit}
            >
              <ModalHeader>Editar Categoría</ModalHeader>

              <ModalBody className='w-full'>
                <Input
                  isRequired
                  name='categoryName'
                  label='Nombre'
                  placeholder='Agrega un nombre a la categoría'
                  variant='underlined'
                  defaultValue={category.name}
                />

                <Input
                  isRequired
                  name='categoryDescription'
                  label='Descripción'
                  placeholder='Agrega una descripción a la categoría'
                  variant='underlined'
                  defaultValue={category.description}
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
                    src={imageError ? warning_error_image : previewImage || no_image}
                    alt='Vista previa'
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className='rounded-lg object-contain'
                    onError={() => setImageError(true)}
                  />
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
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
