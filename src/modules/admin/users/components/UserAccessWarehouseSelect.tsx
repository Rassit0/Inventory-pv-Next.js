"use client"
import { Autocomplete, AutocompleteItem, Avatar, Badge, Button, Input, Select, SelectItem, Tooltip, User } from '@heroui/react';
import React, { useEffect, useState } from 'react'
import { IUser, IUsersResponse } from '@/modules/admin/users';
import { ArrowMoveUpLeftIcon, ArrowShrink02Icon, ArrowTurnBackwardIcon, ArrowTurnDownIcon, ArrowTurnUpIcon, DatabaseRestoreIcon, Delete01Icon, PlusSignIcon, RestoreBinIcon, Search01Icon, WasteRestoreIcon } from 'hugeicons-react';
import Image from 'next/image';
import no_image from '@/assets/no_image.png'
import warning_error_image from '@/assets/warning_error.png'
import { IWarehouseUsersAccess } from '@/modules/admin/warehouses';
import { access } from 'fs';

interface Props {
  usersResponse: IUsersResponse;
  isRequired?: boolean;
  defaultUsersAccess?: IWarehouseUsersAccess[];
}

type TImageErrors = {
  [key: string]: boolean;
};



export const UserAccessWarehouseSelect = ({ usersResponse, isRequired = false, defaultUsersAccess = [] }: Props) => {
  const [usersResponseFiltered, setUsersResponseFiltered] = useState({
    ...usersResponse,
    users: defaultUsersAccess.length <= 0 ? usersResponse.users : usersResponse.users.filter(user =>
      !defaultUsersAccess.some(acces => acces.userId === user.id)
    ),
  });
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>(defaultUsersAccess.length <= 0 ? []
    :
    usersResponse.users.filter(user =>
      defaultUsersAccess.some(access => access.userId === user.id)
    )
  );
  const [backupSelectedUsers, setBackupSelectedUsers] = useState<IUser[]>([])
  const [countDeleteAccess, setCountDeleteAccess] = useState(0);

  // CONTROL DE LAS IMAGENES QUE TIENE ERROR AL CARGAR
  const [imageErrors, setImageErrors] = useState<TImageErrors>({});
  // Si se actualiza los usuarios que llega de page volvera a iniciar los errores para cargar de nuevo
  useEffect(() => {
    setImageErrors({});
  }, [usersResponse]);

  // Funcion para identificar las imagenes con error
  const handleImageError = (userId: string) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [userId]: true,
    }))
  };

  const handleAddUserAccessForm = (value: string) => {
    const selectedItem = usersResponseFiltered.users.find(user => user.id === value);
    if (selectedItem) {
      const newSelectedUsers = [...selectedUsers, selectedItem];
      setSelectedUsers(newSelectedUsers);

      // Verificar si el usuario estaba en el backup para reducir el contador
      if (backupSelectedUsers.some(user => user.id === value)) {
        setCountDeleteAccess(prevCount => Math.max(prevCount - 1, 0)); // Reducir en 1 sin permitir valores negativos
        setBackupSelectedUsers(prevBackup => prevBackup.filter(user => user.id !== value));
      }

      // Eliminar usuario de la lista filtrada
      setUsersResponseFiltered({
        ...usersResponseFiltered,
        users: usersResponseFiltered.users.filter(user => user.id !== value)
      });
    }
  }

  const handleRemoveSelection = (value: string) => {
    const removedUser = selectedUsers.find(user => user.id === value);
    if (!removedUser) return;

    // Acumular los usuarios eliminados en backupSelectedUsers
    setBackupSelectedUsers(prevBackup => {
      // Filtrar los usuarios que aún NO están en prevBackup
      const newUsersToAdd = selectedUsers.filter(user => !prevBackup.some(b => b.id === user.id) && defaultUsersAccess.some(d => d.userId === user.id));

      return [...prevBackup, ...newUsersToAdd]; // Agregar solo los nuevos usuarios eliminados
    });

    // Filtrar los usuarios seleccionados para remover el usuario específico
    setSelectedUsers(prevSelected => prevSelected.filter(user => user.id !== value));

    // Agregar el usuario nuevamente a la lista filtrada sin duplicados
    setUsersResponseFiltered(prevFiltered => ({
      ...prevFiltered,
      users: [...new Map([...prevFiltered.users, removedUser].map(user => [user.id, user])).values()]
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
    if (defaultUsersAccess.some(d => d.userId === removedUser.id)) {
      setCountDeleteAccess(prev => prev + 1);
    }
  };

  const handleUndoRemove = () => {
    if (backupSelectedUsers.length === 0) return; // Evitar cambios innecesarios

    setSelectedUsers(prev => [
      ...backupSelectedUsers,
      ...prev.filter(p => !backupSelectedUsers.some(backup => backup.id === p.id))
    ]); // Restaurar selección anterior

    // Restaurar solo los usuarios eliminados previamente en `usersResponseFiltered`
    setUsersResponseFiltered(prevFiltered => ({
      ...prevFiltered,
      users: prevFiltered.users.filter(user => !backupSelectedUsers.some(backupUser => backupUser.id === user.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));

    setBackupSelectedUsers([]); // Limpiar el backup después de restaurar
    setCountDeleteAccess(0);
  };

  return (
    <div className='flex flex-col space-y-4 w-full'>
      <Autocomplete
        selectedKey={''}
        onSelectionChange={(value) => handleAddUserAccessForm(value as string)}
        // onClose={() => setSelectedKey(null)}
        aria-label="Select an user"
        classNames={{
          base: "max-w-full",
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        defaultItems={usersResponseFiltered.users}
        inputProps={{
          classNames: {
            input: "ml-1",
            inputWrapper: "h-[28px]",
          },
        }}
        listboxProps={{
          hideSelectedIcon: true,
          itemClasses: {
            base: [
              "rounded-medium",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "dark:data-[hover=true]:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[hover=true]:bg-default-200",
              "data-[selectable=true]:focus:bg-default-100",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        placeholder="Buscar usuario..."
        popoverProps={{
          offset: 10,
          classNames: {
            base: "rounded-large",
            content: "p-1 border-small border-default-100 bg-background",
          },
        }}
        radius="full"
        startContent={<Search01Icon className="text-default-400" size={20} strokeWidth={2.5} />}
        variant="bordered"
      >
        {(item) => (
          <AutocompleteItem key={item.id} textValue={item.name}>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar alt={item.name} className="flex-shrink-0" size="sm" src={item.imageUrl || undefined} />
                <div className="flex flex-col">
                  <span className="text-small">{item.name}</span>
                  <span className="text-tiny text-default-400">{item.role.name}</span>
                </div>
              </div>
              <Button
                className="border-small mr-0.5 font-medium shadow-small"
                radius="full"
                size="sm"
                variant="bordered"
                isIconOnly
                startContent={<PlusSignIcon />}
              />
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
      <div className='space-y-2'>
        {((defaultUsersAccess.length > 0 && countDeleteAccess > 0) &&
          (
            <div className='flex items-center'>
              <span className='text-small text-danger-500 mx-2'>Se eliminará {countDeleteAccess} acceso(s) guardado!</span>
              <Tooltip color="primary" content="Resturar">
                <Button onPress={handleUndoRemove} color='primary' radius='full' isIconOnly variant='light' startContent={<ArrowTurnBackwardIcon />} />
              </Tooltip>
            </div>
          )
        )}
        {
          selectedUsers.map(user => (
            <div className='flex gap-2  hover:bg-default-200 rounded-lg p-1' key={user.id}>
              <Button
                color='danger'
                isIconOnly
                radius='full'
                variant='light'
                startContent={<Delete01Icon />}
                onPress={() => handleRemoveSelection(user.id)}
              />
              <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div className='flex items-center space-x-2'>
                  <Badge color="danger" placement='bottom-left' content={!defaultUsersAccess.some(d=>d.userId===user.id)?'':undefined}>
                    <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.imageUrl || undefined} />
                  </Badge>
                  <div className='flex flex-col overflow-hidden'>
                    <span className='text-sm line-clamp-1'>{user.name}</span>
                    <span className='text-xs text-foreground-400'>{user.email}</span>
                  </div>
                </div>
                <input type="hidden" name="userAccessIds" value={user.id} />
                <Select
                  aria-label={`select-${user.id}`}
                  isRequired={isRequired}
                  name={`userAccess[${user.id}]`}
                  placeholder='Seleccionar...'
                  variant='underlined'
                  selectionMode='single'
                  defaultSelectedKeys={[defaultUsersAccess.find(access => access.userId === user.id)?.role || '']}
                >
                  <SelectItem key={'ADMIN'} >Administrado</SelectItem>
                  <SelectItem key={'SUPERVISOR'}>Supervisor</SelectItem>
                  <SelectItem key={'OPERATOR'}>Operador</SelectItem>
                  <SelectItem key={'READER'}>Lector</SelectItem>
                </Select>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
