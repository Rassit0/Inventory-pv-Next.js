"use client"
import { Checkbox } from '@heroui/react';
import React, { useEffect, useState } from 'react'

interface Props {
    all?: 'all';
    onSelectedChange?: (value: boolean) => void;
}
export const ConfirmQuantitiesChecked = ({ all, onSelectedChange }: Props) => {

    const [isSelected, setIsSelected] = useState(all ? true : false)

    useEffect(() => {
        console.log(all)
        if (all=='all') {
            setIsSelected(true)
        } else {
            setIsSelected(false)
        }
    }, [all])

    const handleChangeIsSelected = (value: boolean) => {
        setIsSelected(value)
        if (onSelectedChange)
            onSelectedChange(value)
    }

    return (
        <Checkbox
            isSelected={isSelected}
            onValueChange={(value) => handleChangeIsSelected(value)}

        >Option</Checkbox>
    )
}
