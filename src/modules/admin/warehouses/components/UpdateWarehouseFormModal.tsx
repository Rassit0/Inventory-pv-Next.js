"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { IUsersResponse, UserAccessWarehouseSelect } from '@/modules/admin/users'
import { IBranch } from '@/modules/admin/branches'
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, useDisclosure } from '@heroui/react'
import { IWarehouse, updateWarehouse } from '@/modules/admin/warehouses'
import { PencilEdit01Icon } from 'hugeicons-react'
import Image from 'next/image'
import no_image from '@/assets/no_image.png'
import { toast } from 'sonner'

interface Props {
  warehouse: IWarehouse
  usersResponse: IUsersResponse,
  branches: IBranch[]
}

export const UpdateWarehouseFormModal = ({ warehouse, branches, usersResponse }: Props) => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form
  const [warehouseIsEnable, setWarehouseIsEnable] = useState(warehouse.isEnable);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    const formData = new FormData(e.currentTarget);
    // const dataArray: any[] = [];
    // formData.forEach((value, key) => {
    //   dataArray.push({ key, value });
    // });
    // console.log(dataArray)
    const { error, message, response } = await updateWarehouse(formData, warehouse.id);

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
    toast.success(message);
    setIsLoading(false);
    onClose();
  }
  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        color='warning'
        variant='light'
        radius='full'
        startContent={<PencilEdit01Icon />}
      />
      <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='outside' placement='top' size='5xl'>
        <Form
          validationBehavior='native'
          onSubmit={handleSubmit}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Editar Almacén</ModalHeader>
                <ModalBody className='w-full'>
                  <div className='w-full grid grid-cols-1 2xl:grid-cols-3 gap-4'>
                    <div className="w-full">
                      <h2 className='font-semibold'>Datos del Almacén</h2>
                      <div className='p-2 rounded-lg grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-1 gap-4'>
                        <Input
                          isRequired
                          name='warehouseName'
                          label='Nombre'
                          placeholder='Agrega un nombre'
                          variant='underlined'
                          defaultValue={warehouse.name}
                        />

                        <Input
                          isRequired
                          name='warehouseLocation'
                          label='Ubicación'
                          placeholder='Ingrese la ubicación'
                          variant='underlined'
                          defaultValue={warehouse.location}
                        />

                        <Select
                          isRequired
                          className='md:col-span-2 2xl:col-span-1'
                          name='warehouseBranchIds'
                          aria-label='List branches'
                          label='Sucursal'
                          placeholder='Seleccione la(s) sucursal'
                          variant='underlined'
                          selectionMode='multiple'
                          defaultSelectedKeys={warehouse.branches.map(branch => branch.branchId)}
                        >
                          {
                            branches.map(branch => (
                              <SelectItem key={branch.id}>{branch.name}</SelectItem>
                            ))
                          }
                        </Select>

                        <input type="hidden" name="warehouseIsEnable" value={warehouseIsEnable ? 'true' : 'false'} />
                        <Switch
                          className='pt-4'
                          defaultSelected
                          color="success"
                          size="sm"
                          isSelected={warehouseIsEnable}
                          onValueChange={(value) => setWarehouseIsEnable(value)}
                        >
                          Activo
                        </Switch>
                      </div>
                    </div>

                    {/* Formulario de user access */}
                    <div className='w-full 2xl:col-span-2'>
                      <h2 className='font-semibold'>Acceso de usuarios</h2>
                      <div className='p-2'>
                        {/* <SelectUserAccessWarehouse usersResponse={usersResponse} /> */}
                        <UserAccessWarehouseSelect usersResponse={usersResponse} defaultUsersAccess={warehouse.usersAccess} isRequired />
                      </div>
                    </div>
                  </div>

                  {/* imagen */}
                  <div className="w-full">
                    <h2 className="font-semibold">Selecciona imagen</h2>
                    <div className="gap-4 p-2">
                      <Input
                        name="warehouseImage"
                        label="Imagen"
                        placeholder="Selecciona una imagen de la Sucursal"
                        type="file"
                        variant="underlined"
                        accept='image/*'
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
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    color='danger'
                    variant='light'
                    onPress={onClose}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type='submit'
                    color='primary'
                    className='block'
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
