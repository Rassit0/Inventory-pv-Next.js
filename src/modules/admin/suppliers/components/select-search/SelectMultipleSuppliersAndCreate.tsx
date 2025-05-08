import React from 'react'
import { IPersonsResponse } from '@/modules/admin/persons';
import { SelectSearchSuppliersAndCreate } from './SelectSearchSuppliersAndCreate';

interface Props {
    token: string;
    personsResponse: IPersonsResponse
    label?: string;
    autoFocus?: boolean;
    name?: string;
}
export const SelectSuppliersAndCreate = ({ token, personsResponse, label, autoFocus = false, name }: Props) => {
    return (
        <div className='flex items-center'>
            <SelectSearchSuppliersAndCreate
                isRequired
                personsResponse={personsResponse}
                token={token}
                label={label}
                autoFocus={autoFocus}
                create={true}
                name={name}
            />
            {/* <Listexample /> */}
        </div>
    )
}
