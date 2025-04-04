'use client'
import { IBranch } from '@/modules/admin/branches';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useUIStore } from '@/modules/admin/shared';

interface Props {
  userBranchIds?: string[];
  branches: IBranch[];
  hasGlobalBranchesAccess: boolean;
}

export const NavBranchSelect = ({ branches, userBranchIds, hasGlobalBranchesAccess = false }: Props) => {
  const router = useRouter();
  const { branchId, handleChangeBranchId } = useUIStore();
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branchId || '');
  const [branchName, setBranchName] = useState('Seleccionar Sucursal');

  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    setSelectedBranchId(branchId || '')
    const pathSegments = pathname.split('/').filter(Boolean); // Eliminar segmentos vacíos

    if (pathSegments.length > 1 && pathSegments[pathSegments.length - 2] === 'home') {
      // Si el penúltimo segmento es 'home', actualiza la ruta con el branchId
      // pathSegments.push(selectedBranchId); // Agrega el branchId al final
      pathSegments[pathSegments.length - 1] = branchId||'all'; // Reemplaza el último segmento
      router.push(`/${pathSegments.join('/')}`); // Redirige con la nueva URL


      router.push(`/${pathSegments.join('/')}`);
    }
    // cambia el valor de la variable de sesion
  }, [branchId, pathname])

  // Sincroniza selectedBranchId con el branchId de la tienda
  useEffect(() => {
    if (!hasGlobalBranchesAccess && userBranchIds) {
      if (userBranchIds.length === 1) {
        // Si solo hay un branchId, seleccionamos automáticamente
        setSelectedBranchId(userBranchIds[0]);
      }
    }
  }, [hasGlobalBranchesAccess, userBranchIds]);

  // Actualiza el nombre de la sucursal seleccionada cuando cambia selectedBranchId
  useEffect(() => {
    if (selectedBranchId) {
      const selectedBranch = branches.find(branch => branch.id === selectedBranchId);
      setBranchName(selectedBranch?.name || 'Seleccionar Sucursal');
      handleChangeBranchId(selectedBranchId);
    }
  }, [selectedBranchId, branches, handleChangeBranchId]);

  // Renderiza solo el Dropdown si estamos en una ruta relevante
  if (pathname.includes('home') || pathname.includes('production')) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button className="capitalize" color="primary" variant="ghost" radius="full">
            <span className="text-sm sm:text-xl md:text-2xl lg:text-3xl truncate overflow-hidden whitespace-nowrap">{branchName}</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          selectedKeys={[selectedBranchId]}
          onSelectionChange={(value) => setSelectedBranchId(value.currentKey || '')}
          selectionMode="single"
          aria-label="Dropdown Variants"
          color="primary"
          variant="light"
        >
          {
            // Si tiene acceso global, mostramos todas las sucursales, de lo contrario, solo las accesibles
            (hasGlobalBranchesAccess ? branches : branches.filter(branch => userBranchIds?.includes(branch.id)))
              .map(branch => (
                <DropdownItem key={branch.id}>{branch.name}</DropdownItem>
              ))
          }
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <div></div>
  ); // No renderiza nada si no estamos en una ruta relevante
};
