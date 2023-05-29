import React from 'react'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import style from './BadgeComponent.module.scss'

export default function ButtonComponent(props: any) {
    const {type, value} = props

    let label;
    let color;

    if (type === 'sampler') {
        label = UtilityLibrary.findSamplerLabel(value)
    }
    if (type === 'style') {
        label = UtilityLibrary.findStyleLabel(value)
        const style = UtilityLibrary.findStyle(value)
        if (style) {
            color = style.color
        }
    }

    return (
        <>
            {label && (
                <p className={`${style.BadgeComponent} ${color}`} style={{background: color}}>{label}</p>
            )}
        </>
    )
}
