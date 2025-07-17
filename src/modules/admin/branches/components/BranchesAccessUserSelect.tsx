"use client"
import { Autocomplete, AutocompleteItem, Avatar, Badge, Button, Input, Select, SelectItem, Tooltip, User } from '@heroui/react';
import React, { useEffect, useState } from 'react'
import { IUser, IUserBranch, IUsersResponse } from '@/modules/admin/users';
import { ArrowMoveUpLeftIcon, ArrowShrink02Icon, ArrowTurnBackwardIcon, ArrowTurnDownIcon, ArrowTurnUpIcon, DatabaseRestoreIcon, Delete01Icon, PlusSignIcon, RestoreBinIcon, Search01Icon, WasteRestoreIcon } from 'hugeicons-react';
import { IBranch, IBranchesResponse } from '@/modules/admin/branches';

interface Props {
  branchesResponse: IBranchesResponse;
  isRequired?: boolean;
  defaultBranches?: IUserBranch[];
  name?: string;
}

type TImageErrors = {
  [key: string]: boolean;
};



export const BranchesAccessUserSelect = ({ branchesResponse, isRequired = false, defaultBranches = [], name }: Props) => {
  const [branchesResponseFiltered, setBranchesResponseFiltered] = useState<IBranchesResponse>({
    ...branchesResponse,
    branches: !defaultBranches || defaultBranches.length <= 0 ? branchesResponse.branches : branchesResponse.branches.filter(branch =>
      !defaultBranches.some(dbranch => dbranch.branchId === branch.id)
    ),
  });
  const [selectedBranches, setSelectedBranches] = useState<IBranch[]>(defaultBranches.length <= 0 ? []
    :
    branchesResponse.branches.filter(branch =>
      defaultBranches.some(dbranch => dbranch.branchId === branch.id)
    )
  );
  const [backupSelectedBranches, setBackupSelectedBranches] = useState<IBranch[]>(!defaultBranches || defaultBranches.length <= 0 ?
    []
    : branchesResponse.branches.filter(branch =>
      defaultBranches.some(dbranch => dbranch.branchId === branch.id)
    )
  )
  const [countDeleteAccess, setCountDeleteAccess] = useState(0);

  // CONTROL DE LAS IMAGENES QUE TIENE ERROR AL CARGAR
  const [imageErrors, setImageErrors] = useState<TImageErrors>({});
  // Si se actualiza los usuarios que llega de page volvera a iniciar los errores para cargar de nuevo
  useEffect(() => {
    setImageErrors({});
  }, [branchesResponse]);

  // Funcion para identificar las imagenes con error
  const handleImageError = (userId: string) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [userId]: true,
    }))
  };

  const handleAddBranchesUserAccessForm = (value: string) => {
    const selectedItem = branchesResponseFiltered.branches.find(branch => branch.id === value);
    if (selectedItem) {
      const newSelectedUsers = [...selectedBranches, selectedItem];
      setSelectedBranches(newSelectedUsers);

      // Verificar si el usuario estaba en el backup para reducir el contador
      if (backupSelectedBranches.some(branch => branch.id === value)) {
        setCountDeleteAccess(prevCount => Math.max(prevCount - 1, 0)); // Reducir en 1 sin permitir valores negativos
        setBackupSelectedBranches(prevBackup => prevBackup.filter(branch => branch.id !== value));
      }

      // Eliminar usuario de la lista filtrada
      setBranchesResponseFiltered({
        ...branchesResponseFiltered,
        branches: branchesResponseFiltered.branches.filter(branch => branch.id !== value)
      });
    }
  }

  const handleRemoveSelection = (value: string) => {
    const removedBranch = selectedBranches.find(branch => branch.id === value);
    if (!removedBranch) return;

    // Acumular las sucursales eliminadas en backupSelectedBranches
    setBackupSelectedBranches(prevBackup => {
      // Filtrar los usuarios que aún NO están en prevBackup
      const newUsersToAdd = selectedBranches.filter(branch => !prevBackup.some(b => b.id === branch.id) && defaultBranches.some(d => d.branchId === branch.id));

      return [...prevBackup, ...newUsersToAdd]; // Agregar solo los nuevos usuarios eliminados
    });

    // Filtrar los usuarios seleccionados para remover el usuario específico
    setSelectedBranches(prevSelected => prevSelected.filter(branch => branch.id !== value));

    // Agregar el usuario nuevamente a la lista filtrada sin duplicados
    setBranchesResponseFiltered(prevFiltered => ({
      ...prevFiltered,
      branches: [...new Map([...prevFiltered.branches, removedBranch].map(branch => [branch.id, branch])).values()]
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
    if (defaultBranches.some(d => d.branchId === removedBranch.id)) {
      setCountDeleteAccess(prev => prev + 1);
    }
  };

  const handleUndoRemove = () => {
    if (backupSelectedBranches.length === 0) return; // Evitar cambios innecesarios

    setSelectedBranches(prev => [
      ...backupSelectedBranches,
      ...prev.filter(p => !backupSelectedBranches.some(backup => backup.id === p.id))
    ]); // Restaurar selección anterior

    // Restaurar solo los usuarios eliminados previamente en `branchesResponseFiltered`
    setBranchesResponseFiltered(prevFiltered => ({
      ...prevFiltered,
      branches: prevFiltered.branches.filter(user => !backupSelectedBranches.some(backupUser => backupUser.id === user.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));

    setBackupSelectedBranches([]); // Limpiar el backup después de restaurar
    setCountDeleteAccess(0);
  };

  return (
    <div className='flex flex-col space-y-4 w-full'>
      <Autocomplete
        name={name}
        selectedKey={''}
        onSelectionChange={(value) => handleAddBranchesUserAccessForm(value as string)}
        // onClose={() => setSelectedKey(null)}
        aria-label="Select an user"
        classNames={{
          base: "max-w-full",
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        defaultItems={branchesResponseFiltered.branches}
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
                  {/* <span className="text-tiny text-default-400">{item.role.name}</span> */}
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
        {((defaultBranches.length > 0 && countDeleteAccess > 0) &&
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
          selectedBranches.map(branch => (
            <div className='flex gap-2  hover:bg-default-200 rounded-lg p-1' key={branch.id}>
              <Button
                color='danger'
                isIconOnly
                radius='full'
                variant='light'
                startContent={<Delete01Icon />}
                onPress={() => handleRemoveSelection(branch.id)}
              />
              <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div className='flex items-center space-x-2'>
                  <Badge color="danger" placement='bottom-left' content={!defaultBranches.some(d => d.branchId === branch.id) ? '' : undefined}>
                    <Avatar alt={branch.name} className="flex-shrink-0" size="sm" src={branch.imageUrl || undefined} />
                  </Badge>
                  <div className='flex flex-col overflow-hidden'>
                    <span className='text-sm line-clamp-1'>{branch.name}</span>
                    <span className='text-xs text-foreground-400'>{branch.email}</span>
                  </div>
                </div>
                <input type="hidden" name="userBranchesIds" value={branch.id} />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
