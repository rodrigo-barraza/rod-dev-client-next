import React from 'react'
import style from './ButtonComponent.module.scss'

export default function ButtonComponent(props: any) {
    const {label, type, className, disabled, onClick}: {label: string, type: string, className: string, disabled: boolean, onClick: any} = props

    let combinedClassNames;
    if (className) {
        combinedClassNames = className
            .split(' ')
            .map((name) => style[name])
            .join(' ');
    }

    return (
        <div className={`${style.ButtonComponent} ${combinedClassNames}`} disabled={disabled} onClick={onClick}>
        <button type={type} disabled={disabled}>{label}</button>
    </div>
    )
}
