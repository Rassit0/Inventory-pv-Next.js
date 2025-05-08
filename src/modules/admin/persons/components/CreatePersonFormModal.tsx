'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';
import { Add01Icon } from 'hugeicons-react';
import { ImageUploaderInput } from '../../shared';
import { createPerson, IPerson } from '@/modules/admin/persons';

interface Props {
  onCreate?: (person: IPerson | null) => void;
  token: string;
}

export const CreatePersonFormModal = ({ token, onCreate }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Form
  const [personName, setPersonName] = useState('');
  const [personLastname, setPersonLastname] = useState('');
  const [personSeconLastname, setPersonSeconLastname] = useState('');
  const [personNit, setPersonNit] = useState('');

  // useEffect para resetear la previsualización al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setPreviewImage(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formRef.current) return;


    setIsLoading(true);

    const formData = new FormData(formRef.current);

    // EJECUTAR SERVER ACTIONS PARA GUARDAR
    const { error, message, response, person } = await createPerson({ formData, token });
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
    onClose();
    setIsLoading(false);
    if (onCreate) onCreate(person || null)
  }

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        color='primary'
        variant='light'
        radius='full'
        startContent={<Add01Icon />}
      />

      <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} size='4xl'>
        <Form
          ref={formRef}
          validationBehavior='native'
          // validationErrors={errors}
          onSubmit={handleSubmit}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Crear Persona</ModalHeader>

                <ModalBody className='w-full grid lg:grid-cols-3'>
                  <div className='lg:col-span-1 pb-6 w-full'>
                    <h2 className="font-semibold">Imagen de presentación</h2>
                    <ImageUploaderInput name='personImage' imageDefault={previewImage || undefined} />
                  </div>
                  <div className='lg:col-span-2'>
                    <h2 className="font-semibold">Datos generales</h2>
                    <div className='p-2'>
                      <Input
                        isRequired
                        name='personName'
                        label='Nombre'
                        placeholder='Agrega un nombre'
                        variant='underlined'
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') setPersonName(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                        }}
                        onBlur={() => {
                          setPersonName(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                        }}
                      />

                      <Input
                        isRequired
                        name='personLastname'
                        label='Apellido Paterno'
                        placeholder='Agrega apellido paterno'
                        variant='underlined'
                        value={personLastname}
                        onChange={(e) => setPersonLastname(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') setPersonLastname(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                        }}
                        onBlur={() => {
                          setPersonLastname(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                        }}
                      />

                      <Input
                        name='personSecondLastname'
                        label='Apellido Materno'
                        placeholder='Agrega apellido materno'
                        variant='underlined'
                        value={personSeconLastname}
                        onChange={(e) => setPersonSeconLastname(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') setPersonSeconLastname(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                        }}
                        onBlur={() => {
                          setPersonSeconLastname(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                        }}
                      />

                      <Input
                        isRequired
                        name="personNit"
                        label="Nit o CI"
                        placeholder="Agrega NIT o CI"
                        variant="underlined"
                        value={personNit}
                        onChange={(e) => {
                          const onlyNumbers = e.target.value.replace(/\D/g, '');
                          setPersonNit(onlyNumbers);
                        }}
                        onKeyDown={(e) => {
                          // Bloquear letras y caracteres no numéricos
                          if (
                            !/[0-9]/.test(e.key) && // Si no es número
                            e.key !== 'Backspace' &&
                            e.key !== 'ArrowLeft' &&
                            e.key !== 'ArrowRight' &&
                            e.key !== 'Tab'
                          ) {
                            e.preventDefault();
                          }

                          // Si presiona Enter o espacio, puedes hacer alguna acción adicional si deseas
                          if (e.key === ' ' || e.key === 'Enter') {
                            setPersonNit((prev) => prev.trim());
                          }
                        }}
                        onBlur={() => {
                          setPersonNit((prev) => prev.trim());
                        }}
                      />
                    </div>
                  </div>

                </ModalBody>

                <ModalFooter>
                  <Button color='danger' variant='light' onPress={onClose}>Cancelar</Button>
                  <Button
                    type='button'
                    onPress={handleSubmit}
                    color='primary'
                    isLoading={isLoading}
                    isDisabled={isLoading}
                  >
                    Guardar
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
