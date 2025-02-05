"use client"
import { Button, Form, Input, Select, SelectItem, Switch } from '@heroui/react'
import React, { FormEvent, useState } from 'react'
import { ISupplierContactInfo } from '../interfaces/supplier-response';
import { CheckmarkCircle01Icon, Delete01Icon, PlusSignIcon } from 'hugeicons-react';
import { createSupplier } from '../actions/create-supplier';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const CreateSupplierForm = () => {
  const router = useRouter();

  const [supplierIsActive, setSupplierIsActive] = useState<boolean>(true);
  const [contacts, setContacts] = useState<ISupplierContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleContactChange = (id: number, field: keyof ISupplierContactInfo, value: string) => {
    setContacts((prev) => {
      const updatedContact = [...prev];
      const contactIndex = updatedContact.findIndex((contact) => contact.id === id);
      if (contactIndex >= 0) {
        updatedContact[contactIndex] = {
          ...updatedContact[contactIndex],
          [field]: value
        };
      }
      return updatedContact;
    })
  }

  const handleAddContactForm = async (id?: number) => {
    setContacts((prev) => {

      // Obtener el ID más alto en la lista y sumarle 1
      const newId = id ?? (prev.length > 0 ? Math.max(...prev.map(c => c.id ?? 0)) + 1 : 1);

      return [
        ...prev,
        {
          id: newId,
          contactName: "",
          email: "",
          phoneNumber: '',
          phoneType: null,
          position: 'MANAGER',
          isPrimary: false,
        }
      ];
    });

    console.log(contacts)
  }

  const handleRemoveContactForm = (id: number) => {
    console.log(id)
    console.log(contacts)
    // Eliminar el formulario de contacto de la lista de contactos
    setContacts((prev) => {
      const updatedContacts = prev.filter(contact => contact.id !== id);
      return updatedContacts;
    });
  }

  const handleIsPrimaryChange = (id: number, value: boolean) => {
    setContacts((prev) => {
      const updateContacts = prev.map(contact => ({
        ...contact,
        isPrimary: id === contact.id && value ? true : false,
      }))
      return updateContacts;
    });
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
    const { error, message, response } = await createSupplier(formData);
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

    // Si se guarda con exito
    toast.success(message);
    setIsLoading(false);
    router.push('/admin/suppliers');

    return;
  }
  return (
    <Form
      validationBehavior='native'
      className="bg-white px-6 pt-8 pb-12 shadow-md hover:shadow-lg rounded space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className='text-2xl font-semibold'>Formulario</h2>

      <div className="w-full">
        <h2 className='font-semibold'>Datos generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <Input
            isRequired
            name='supplierName'
            label='Nombre'
            placeholder='Ingrese el nombre del contacto'
            variant='underlined'
          />

          <Input
            isRequired
            name='supplierAddress'
            label='Dirección'
            placeholder='Ingrese el nombre del contacto'
            variant='underlined'
          />

          <Input
            isRequired
            name='supplierCity'
            label='Ciudad'
            placeholder='Ingrese el nombre del contacto'
            variant='underlined'
          />

          <Input
            isRequired
            name='supplierState'
            label='Estado o provincia'
            placeholder='Ingrese el nombre del contacto'
            variant='underlined'
          />

          <Input
            isRequired
            name='supplierCountry'
            label='País'
            placeholder='Ingrese el nombre del contacto'
            variant='underlined'
          />

          <Input
            name='supplierZipCode'
            label='C. Postal'
            placeholder='Ingrese el codigo postal'
            variant='underlined'
          />

          <Input
            name='supplierTaxId'
            label='NIT o id Fiscal'
            placeholder='Ingrese el nombre del contacto'
            variant='underlined'
          />

          <Input
            name='supplierWebsiteUrl'
            label='URL sitio web'
            placeholder='Ingrese una url del sitio'
            variant='underlined'
          />

          <input type="hidden" name="supplierIsActive" value={supplierIsActive ? 'true' : 'false'} />
          <Switch
            className='pt-4'
            name='supplierIsActive'
            defaultSelected
            color="success"
            size="sm"
            isSelected={supplierIsActive}
            onValueChange={(value) => setSupplierIsActive(value)}
          >
            Activo
          </Switch>
        </div>
      </div>

      <div className="w-full">
        <h2 className='font-semibold'>Contacto(s)</h2>
        <div className='space-y-4 p-2'>
          {contacts.map((contact, index) => (
            <div key={contact.id} className='hover:bg-primary-50 rounded-lg p-4'>
              <h3 className='font-semibold'>Nuevo contacto</h3>

              <input type="hidden" name="supplierIds" value={contact.id} />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                  isRequired
                  name={`contactName[${contact.id}]`}
                  label='Nombre'
                  placeholder='Ingrese el nombre del contacto'
                  variant='underlined'
                  value={contact.contactName}
                  onChange={(e) => handleContactChange(contact.id, 'contactName', e.target.value)}
                />

                <Input
                  type='email'
                  name={`contactEmail[${contact.id}]`}
                  label='Correo'
                  placeholder='Ingrese el nombre del contacto'
                  variant='underlined'
                  value={contact.email || ''}
                  onChange={(e) => handleContactChange(contact.id, 'email', e.target.value)}
                />

                <Input
                  // isRequired={contact.phoneType ? true : false}
                  isRequired
                  name={`contactPhoneNumber[${contact.id}]`}
                  label='Número de contacto'
                  placeholder='Ingrese el número del contacto'
                  variant='underlined'
                  startContent={<span className='text-sm text-gray-500'>+591 </span>}
                  value={contact.phoneNumber || ''}
                  onChange={(e) => handleContactChange(contact.id, 'phoneNumber', e.target.value)}
                  inputMode='numeric'
                  // pattern='[0-9]*'
                  validate={(value) => {
                    // Verifica si el valor contiene solo números
                    if (value && !/^\d+$/.test(value)) {
                      return "Solo se permiten números";  // Mensaje de error si no es un número
                    }

                    // Puedes agregar más validaciones si es necesario
                    return null;  // Si no hay error
                  }}
                // isInvalid={contact.phoneType ? undefined : contact.phoneNumber !== '' ? undefined : false}
                />

                <Select
                  isRequired={contact.phoneNumber && contact.phoneNumber !== '' ? true : false}
                  name={`contactPhoneType[${contact.id}]`}
                  label='Tipo de teléfono'
                  variant='underlined'
                  selectedKeys={[contact.phoneType || '']}
                  onSelectionChange={(value) => handleContactChange(contact.id, 'phoneType', value.currentKey || '')}
                  isInvalid={contact.phoneNumber !== '' ? undefined : false}
                >
                  <SelectItem key='MOBILE'>Movil</SelectItem>
                  <SelectItem key='LANDLINE'>Fijo</SelectItem>
                  <SelectItem key='WHATSAPP'>Whatsapp</SelectItem>
                  <SelectItem key='OTHER'>Otro</SelectItem>
                </Select>

                <Select
                  isRequired
                  name={`contactPosition[${contact.id}]`}
                  label='Rol del contacto'
                  variant='underlined'
                  selectedKeys={[contact.position || '']}
                  onSelectionChange={(value) => handleContactChange(contact.id, 'position', value.currentKey || '')}
                >
                  <SelectItem key={'SALES'}>Ventas</SelectItem>
                  <SelectItem key={'SUPPORT'}>Soporte</SelectItem>
                  <SelectItem key={'MANAGER'}>Gerente</SelectItem>
                  <SelectItem key={'ADMINISTRATOR'}>Administrador</SelectItem>
                  <SelectItem key={'OTHER'}>Otro</SelectItem>
                </Select>

                <input type="hidden" name={`contactIsPrimary[${contact.id}]`} value={String(contact.isPrimary)} />
                <Switch
                  className='pt-4'
                  defaultSelected
                  color="success"
                  size="sm"
                  isSelected={contact.isPrimary}
                  onValueChange={(value) => handleIsPrimaryChange(contact.id, value)}
                >
                  Contacto Principal
                </Switch>
              </div>

              <Button
                isIconOnly
                radius='full'
                size='sm'
                color='danger'
                className='mt-4'
                variant='light'
                startContent={<Delete01Icon />}
                onPress={() => handleRemoveContactForm(contact.id)}
              />
            </div>
          ))}

          <Button
            isIconOnly
            radius='full'
            size='sm'
            color='primary'
            variant='ghost'
            startContent={<PlusSignIcon />}
            onPress={() => handleAddContactForm()}
          />
        </div>
      </div>

      <Button
        type='submit'
        color='primary'
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        Guardar Proveedor
      </Button>
    </Form>
  )
}
