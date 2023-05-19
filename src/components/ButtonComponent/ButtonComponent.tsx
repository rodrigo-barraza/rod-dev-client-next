import React from 'react'
import style from './ButtonComponent.module.scss'

export default function ButtonComponent(props: any) {
    const {label, type, className, disabled, onClick}: {label: string, type: string, className: string, disabled: boolean, onClick: any} = props
    return (
        <div className={`${style.ButtonComponent} ${className === 'secondary' ? style.secondary : ''}`} disabled={disabled} onClick={onClick}>
        <button type={type} disabled={disabled}>{label}</button>
    </div>
    )
}
