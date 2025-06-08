'use client'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Select, SelectItem, Switch, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';
import { Add01Icon, Delete01Icon, PlusSignIcon } from 'hugeicons-react';
import { ImageUploaderInput } from '../../shared';
import { createPerson, IPerson, IPersonsResponse, SelectSearchPersonAndCreate } from '@/modules/admin/persons';
import { useRouter } from 'next/navigation';
import { createSupplier, ISupplier, ISupplierContactInfo } from '@/modules/admin/suppliers';

interface Contact {
  id: number;
  name: string;
  phone?: string;
}

interface Props {
  onCreate?: (person: ISupplier | null) => void;
  token: string;
  createContact: boolean;
  personsResponse: IPersonsResponse;
}

export const CreateSupplierFormModal = ({ token, createContact, personsResponse, onCreate }: Props) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  // Form
  const [supplierIsActive, setSupplierIsActive] = useState<boolean>(true);
  const [contacts, setContacts] = useState<ISupplierContactInfo[]>([]);
  const [supplierType, setSupplierType] = useState<'INDIVIDUAL' | 'COMPANY'>("COMPANY");
  const [supplierName, setSupplierName] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [supplierCity, setSupplierCity] = useState('');
  const [supplierState, setSupplierState] = useState('');
  const [supplierCountry, setSupplierCountry] = useState('');
  const [contactName, setContactName] = useState<Record<number, Contact>>();
  const [selectedPerson, setSelectedPerson] = useState<IPerson | null>(null)
  const [supplierTaxId, setSupplierTaxId] = useState('');
  // useEffect
  useEffect(() => {
    if (supplierType === 'INDIVIDUAL') {
      if (selectedPerson) {
        setSupplierTaxId(selectedPerson.nit);
        console.log(selectedPerson.nit)
        return;
      }
      setSupplierTaxId('');
    }
  }, [selectedPerson, supplierType])

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
          lastname: '',
          secondLastname: '',
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
    if (!formRef.current) return;

    setIsLoading(true);
    const formData = new FormData(formRef.current);
    const dataArray: any[] = [];
    formData.forEach((value, key) => {
      dataArray.push({ key, value });
    });
    console.log(dataArray)
    const { error, message, response, supplier } = await createSupplier({ token, formData });
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
    onClose();
    setIsLoading(false);
    console.log(supplier)
    if (onCreate) onCreate(supplier || null)
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

      <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} size='5xl'>
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

                <ModalBody className='w-full'>
                  <div className="w-full">
                    <h2 className='font-semibold'>
                      Datos generales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className='md:col-span-2 lg:col-span-3'>
                        <RadioGroup
                          isRequired
                          name='supplierType'
                          value={supplierType}
                          onValueChange={(value) => setSupplierType(value as 'COMPANY' | 'INDIVIDUAL')}
                          classNames={{
                            label: "text-small"
                          }}
                          size='sm' label="Tipo de transacción" orientation="horizontal">
                          <Radio value="COMPANY">Empresa</Radio>
                          {/* <Radio value="OUTCOME">Salida</Radio> */}
                          <Radio value="INDIVIDUAL">Individual</Radio>
                        </RadioGroup>
                        {
                          supplierType === 'INDIVIDUAL' && (
                            <SelectSearchPersonAndCreate
                              isRequired
                              personsResponse={personsResponse}
                              token={token}
                              label='Proveedor personal'
                              autoFocus={false}
                              create={true}
                              name='supplierPersonId'
                              selectionMode='single'
                              onSelecteSingledPerson={(person) => {
                                setSelectedPerson(person)
                              }}
                            />
                          )
                        }
                      </div>
                      {supplierType === 'COMPANY' && (
                        <Input
                          isRequired
                          name='supplierName'
                          label='Nombre'
                          placeholder='Ingrese el nombre del contacto'
                          variant='underlined'
                          value={supplierName}
                          onChange={(e) => setSupplierName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') setSupplierName(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                          }}
                          onBlur={() => {
                            setSupplierName(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                          }}
                        />
                      )}

                      <Input
                        isRequired
                        name='supplierAddress'
                        label='Dirección'
                        placeholder='Ingrese el nombre del contacto'
                        variant='underlined'
                        value={supplierAddress}
                        onChange={(e) => setSupplierAddress(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') setSupplierAddress(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                        }}
                        onBlur={() => {
                          setSupplierAddress(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                        }}
                      />

                      <Input
                        isRequired
                        name='supplierCity'
                        label='Ciudad'
                        placeholder='Ingrese el nombre del contacto'
                        variant='underlined'
                        value={supplierCity}
                        onChange={(e) => setSupplierCity(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') setSupplierCity(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                        }}
                        onBlur={() => {
                          setSupplierCity(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                        }}
                      />

                      <Input
                        isRequired
                        name='supplierState'
                        label='Estado o provincia'
                        placeholder='Ingrese el nombre del contacto'
                        variant='underlined'
                        value={supplierState}
                        onChange={(e) => setSupplierState(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') setSupplierState(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                        }}
                        onBlur={() => {
                          setSupplierState(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                        }}
                      />

                      <Input
                        isRequired
                        name='supplierCountry'
                        label='País'
                        placeholder='Ingrese el nombre del contacto'
                        variant='underlined'
                        value={supplierCountry}
                        onChange={(e) => setSupplierCountry(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') setSupplierCountry(prev => prev.charAt(0).toUpperCase() + prev.slice(1))
                        }}
                        onBlur={() => {
                          setSupplierCountry(prev => prev.charAt(0).toUpperCase() + prev.slice(1));
                        }}
                      />

                      <Input
                        name='supplierTaxId'
                        label='NIT o id Fiscal'
                        placeholder='Ingrese el nombre del contacto'
                        variant='underlined'
                        isDisabled={supplierType === 'INDIVIDUAL'}
                        value={supplierTaxId}
                        onChange={(e) => setSupplierTaxId(e.target.value)}
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

                  {createContact && (<div className="w-full">
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
                              onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') handleContactChange(contact.id, 'contactName', contact.contactName.charAt(0).toUpperCase() + contact.contactName.slice(1));
                              }}
                              onBlur={() => {
                                handleContactChange(contact.id, 'contactName', contact.contactName.charAt(0).toUpperCase() + contact.contactName.slice(1));
                              }}
                            />
                            <Input
                              isRequired
                              name={`contactLastname[${contact.id}]`}
                              label='Apellido'
                              placeholder='Ingrese el apellido del contacto'
                              variant='underlined'
                              value={contact.lastname}
                              onChange={(e) => handleContactChange(contact.id, 'lastname', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') handleContactChange(contact.id, 'lastname', contact.lastname.charAt(0).toUpperCase() + contact.contactName.slice(1));
                              }}
                              onBlur={() => {
                                handleContactChange(contact.id, 'lastname', contact.lastname.charAt(0).toUpperCase() + contact.contactName.slice(1));
                              }}
                            />
                            <Input
                              name={`contactSecondLastname[${contact.id}]`}
                              label='Segundo Apellido'
                              placeholder='Ingrese el segundo apellido'
                              variant='underlined'
                              value={contact.secondLastname || ''}
                              onChange={(e) => handleContactChange(contact.id, 'secondLastname', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') handleContactChange(contact.id, 'secondLastname', contact.secondLastname ? contact.secondLastname.charAt(0).toUpperCase() + contact.secondLastname.slice(1) : '');
                              }}
                              onBlur={() => {
                                handleContactChange(contact.id, 'secondLastname', contact.secondLastname ? contact.contactName.charAt(0).toUpperCase() + contact.contactName.slice(1) : '');
                              }}
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

                            <input type="hidden" name={`contactPhoneType[${contact.id}]`} value='MOBILE' />
                            {/* <Select
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
                </Select> */}

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
                  </div>)}

                </ModalBody>

                <ModalFooter>
                  <Button color='danger' variant='light' onPress={onClose}>Cancelar</Button>
                  <Button
                    type='submit'
                    // onPress={handleSubmit}
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
