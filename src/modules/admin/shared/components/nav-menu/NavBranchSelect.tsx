'use client'
import { IBranch, IBranchesResponse, SelectSearchBranchAndCreate } from '@/modules/admin/branches';
import React, { useEffect, useState } from 'react'
import { useUIStore } from '@/modules/admin/shared';

interface Props {
  token: string;
  userBranchIds?: string[];
  branchesResponse: IBranchesResponse;
  hasGlobalBranchesAccess: boolean;
}

export const NavBranchSelect = ({ branchesResponse, userBranchIds, hasGlobalBranchesAccess = false, token }: Props) => {
  const { branchId, handleChangeBranchId } = useUIStore();

  return (
    <SelectSearchBranchAndCreate
      token={token}
      itemsResponse={branchesResponse}
      branchesIds={userBranchIds}
      defaultSelectedItemIds={[branchId || '']}
      onItemSelectedChange={async (selectedItems) => {
        console.log('Selected branch:', selectedItems ? selectedItems[0] : null);
        if (selectedItems && selectedItems.length > 0) {
          await handleChangeBranchId(selectedItems[0].id);
        }
      }}
      selectionMode='single'
    />
  );
};
