"use client"
import React from 'react'
import { NavMenuButton } from './NavMenuButton'
import { NavMenuSearchInput } from './NavMenuSearchInput'

export const NavMenu = () => {
    return (
        <nav className='navbar'>
            <div className='navbar__container'>
                <NavMenuButton />
                <NavMenuSearchInput />
            </div>
        </nav>
    )
}
