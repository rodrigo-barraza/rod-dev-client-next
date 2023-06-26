import React from 'react'
import style from './TextAreaComponent.module.scss'

export default function TextAreaComponent(props: any) {
    const {label, value, onChange, onKeyDown, disabled}: {label: string, value: string, onChange: any, onKeyDown: any, disabled: boolean} = props
    return (
    <div className={style.TextAreaComponent}>
        <label>{label}</label>
        <textarea value={value} onChange={event => onChange(event.target.value)} onKeyDown={event => onKeyDown(event)} disabled={disabled}></textarea>
    </div>
    )
}
