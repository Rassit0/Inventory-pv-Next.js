"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Select, SelectItem, Tooltip } from '@heroui/react';
import React, { useState } from 'react'
import { IBranch } from '@/modules/admin/branches';
import { IBranchProductStock, IProduct } from '@/modules/admin/products';
import { ArrowTurnBackwardIcon, Delete01Icon, PlusSignIcon } from 'hugeicons-react';


interface Props {
    branches: IBranch[];
    branchProductStock: IBranchProductStock[]
    setBranchProductInvetory: (obj: IBranchProductStock[]) => void;
    handleBranchInventoryChange: (branchId: string, field: keyof IBranchProductStock, value: string) => void;
    product: IProduct;
    handleRemoveBranchForm: (branchId: string) => void;
    handleAddBranchForm: (branchId: string) => void;
    availableBranches: IBranch[];
    handlingUnitAbbreviation: string
}

export const InventoryByBranchForm = ({ branchProductStock, branches, handleBranchInventoryChange, product, handleRemoveBranchForm, handleAddBranchForm, availableBranches, setBranchProductInvetory, handlingUnitAbbreviation }: Props) => {


    const [backupBranchProductInventory, setBackupBranchProductInventory] = useState<IBranchProductStock[]>(product.branchProductStock)
    const [countDeleteInventory, setCountDeleteInventory] = useState(0)

    const handleRemoveInventoryForm = (branchId: string) => {
        if (backupBranchProductInventory.some(backup => backup.branchId === branchId)) {
            setCountDeleteInventory(prev => prev + 1);
        }
        handleRemoveBranchForm(branchId);
    }

    const handleRestoreBackup = () => {
        setBranchProductInvetory([...backupBranchProductInventory, ...branchProductStock.filter(invetory =>
            !backupBranchProductInventory.some(backup => backup.branchId === invetory.branchId)
        )]);
        setCountDeleteInventory(0);
    }

    return (
        <div className="w-full">
            <h2 className="font-semibold">Inventario por Sucursal</h2>
            <div className="space-y-4 p-2">
                {((countDeleteInventory > 0) &&
                    (
                        <div className='flex items-center'>
                            <span className='text-small text-danger-500 mx-2'>Se eliminará {countDeleteInventory} inventario(s) guardado!</span>
                            <Tooltip color="primary" content="Resturar">
                                <Button onPress={handleRestoreBackup} color='primary' radius='full' isIconOnly variant='light' startContent={<ArrowTurnBackwardIcon />} />
                            </Tooltip>
                        </div>
                    )
                )}
                {branchProductStock.map((branchInventory, index) => (
                    <div key={branchInventory.branchId} className="hover:bg-primary-50 rounded-lg p-4">
                        {/* Contenedor de título e indicador */}
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">
                                Sucursal: {branches.find(branch => branch.id === branchInventory.branchId)?.name || "Sucursal no encontrada"}
                            </h3>
                            {/* Punto verde si hay cambios en los valores */}
                            {(() => {
                                const originalInventory = product.branchProductStock.find(inventory => inventory.branchId === branchInventory.branchId);

                                if (!originalInventory) return <span className="min-w-3 h-3 bg-green-500 rounded-full"></span>;

                                // Comparar dinámicamente todas las propiedades usando `keyof IBranchProductInventory`
                                const hasChanges = (Object.keys(branchInventory) as (keyof IBranchProductStock)[]).some((key) => {
                                    const currentValue = branchInventory[key];
                                    const originalValue = originalInventory[key];

                                    // Manejar el caso especial de fechas
                                    if (currentValue instanceof Date && originalValue instanceof Date) {
                                        return currentValue.toISOString() !== originalValue.toISOString();
                                    }

                                    return currentValue !== originalValue;
                                });

                                return hasChanges && <span className="min-w-3 h-3 bg-danger-500 rounded-full"></span>;
                            })()}
                        </div>
                        <input type="hidden" name="branchesIds" value={branchInventory.branchId} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                isRequired
                                min={1}
                                name={`inventoryStock[${branchInventory.branchId}]`}
                                label="Stock"
                                type="number"
                                variant="underlined"
                                value={branchInventory.stock}
                                onChange={(e) => handleBranchInventoryChange(branchInventory.branchId, 'stock', e.target.value)}
                                endContent={<div className="text-default-400">{handlingUnitAbbreviation}</div>}
                            />
                        </div>

                        <Button
                            isIconOnly
                            radius="full"
                            size="sm"
                            color="danger"
                            onPress={() => handleRemoveInventoryForm(branchInventory.branchId)}
                            className="mt-4"
                            startContent={<Delete01Icon />}
                        />
                    </div>
                ))}
                <Dropdown>
                    <DropdownTrigger>
                        <Button color="primary" radius="full" size="sm" isIconOnly variant="ghost" startContent={<PlusSignIcon />} />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Dynamic Actions" items={availableBranches}>
                        {(item) => (
                            <DropdownItem
                                key={item.id}
                                onPress={() => handleAddBranchForm(item.id)}
                            >
                                {item.name}
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    )
}
