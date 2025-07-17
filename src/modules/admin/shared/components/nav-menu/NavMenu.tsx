import React from 'react'
import { NavMenuAlert, NavMenuButton, NavMenuSearchInput, NavMenuUser } from '@/modules/admin/shared'
import { Button } from '@heroui/react'
import { ShoppingCart01Icon } from 'hugeicons-react'
import { NavOrderMenuButton } from './NavOrderMenuButton'
import { NavBranchSelect } from './NavBranchSelect'
import { IBranchesResponse } from '@/modules/admin/branches'
import { IParallelGroup } from '@/modules/admin/production'

interface Props {
    token: string;
    userBranchIds?: string[];
    branchesResponse: IBranchesResponse;
    // hiddeBranches: boolean;
    parallelGroups?: IParallelGroup[];
    hasGlobalBranchesAccess?: boolean;
}

export const NavMenu = ({ token, userBranchIds, branchesResponse, parallelGroups, hasGlobalBranchesAccess = false }: Props) => {
    return (
        <nav className='navbar'>
            <div className='navbar__container'>
                <NavMenuButton />
                {/* <NavMenuSearchInput /> */}
                {/* <span className='font-bold text-3xl tracking-widest'>
                    <span className='text-primary'>{branchName}</span>
                </span> */}
                <NavBranchSelect
                    token={token}
                    hasGlobalBranchesAccess={hasGlobalBranchesAccess}
                    branchesResponse={branchesResponse}
                    userBranchIds={userBranchIds} />
                <div className='flex space-x-4 items-center'>
                    {parallelGroups && (
                        <NavOrderMenuButton token={token} parallelGroups={parallelGroups} />
                    )}
                    <NavMenuAlert token={token} />
                    <NavMenuUser />
                </div>
            </div>
        </nav>
    )
}
