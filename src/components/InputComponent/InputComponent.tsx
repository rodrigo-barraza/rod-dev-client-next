import React from 'react'
import style from './InputComponent.module.scss'

export default function InputComponent(props: any) {
    const {label, type, value, onChange}: {label: string, type: string, value: string, onChange: any} = props
    return (
    <div className={style.InputComponent}>
        <label>{label}</label>
        <input value={value} type={type} onChange={event => onChange(event.target.value)}></input>
    </div>
    )
}
