import React from 'react'
import style from './ButtonComponent.module.scss'

export default function ButtonComponent(props: any) {
    const {label, type, disabled}: {label: string, type: string, disabled: boolean} = props
    return (
        <div className={style.ButtonComponent} disabled={disabled}>
        <button type={type} disabled={disabled}>{label}</button>
    </div>
    )
}
