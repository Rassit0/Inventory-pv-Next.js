import React from 'react'
import { IPersonsResponse, SelectAutocompletePersons } from '@/modules/admin/persons';

interface Props {
    token: string;
    personsResponse: IPersonsResponse
    label?: string;
    autoFocus?: boolean;
}
export const SelectSupplierAndCreate = ({ token, personsResponse, label, autoFocus = false }: Props) => {
    return (
        <div className='flex items-center'>
            <SelectAutocompletePersons
                isRequired
                personsResponse={personsResponse}
                token={token}
                label={label}
                autoFocus={autoFocus}
            />
            {/* <Listexample /> */}
        </div>
    )
}
