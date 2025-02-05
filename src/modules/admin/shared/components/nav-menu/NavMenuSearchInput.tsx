// snnipet rafc
import { Input } from '@nextui-org/react'
import { Search01Icon } from 'hugeicons-react'
import React from 'react'

export const NavMenuSearchInput = () => {
  return (
    <Input
        startContent={<Search01Icon color='#0a0a0a'/>}
        placeholder='Busca un producto'
        className='max-w-sm'
    />
  )
}
