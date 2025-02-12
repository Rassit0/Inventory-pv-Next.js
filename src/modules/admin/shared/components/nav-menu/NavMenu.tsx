"use client"
import React from 'react'
import { NavMenuButton } from './NavMenuButton'
import { NavMenuSearchInput } from './NavMenuSearchInput'
import { NavMenuUser } from './NavMenuUser'
import { NavMenuAlert } from './NavMenuAlert'

export const NavMenu = () => {
    return (
        <nav className='navbar'>
            <div className='navbar__container'>
                <NavMenuButton />
                <NavMenuSearchInput />
                <div className='flex space-x-4 items-center'>
                    <NavMenuAlert />
                    <NavMenuUser />
                </div>
            </div>
        </nav>
    )
}
