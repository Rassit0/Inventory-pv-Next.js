import React from 'react'
import { IPersonsResponse, SelectMultipleSearchPersonsAndCreate } from '@/modules/admin/persons';

interface Props {
    token: string;
    personsResponse: IPersonsResponse
    label?: string;
    autoFocus?: boolean;
    name?: string;
    onPersonsChange?: (personsResponse: IPersonsResponse) => void;
}
export const SelectPersonAndCreate = ({ token, personsResponse, label, autoFocus = false, name, onPersonsChange }: Props) => {
    return (
        <div className='flex items-center'>
            <SelectMultipleSearchPersonsAndCreate
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
