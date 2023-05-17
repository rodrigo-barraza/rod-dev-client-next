import React from 'react'
import style from './SelectComponent.module.scss'

export default function SelectComponent(props: any) {
    const {label, value, options, onChange}: {label: string, value: string, options: Array<string>, onChange: any} = props
    return (
    <div className={style.SelectComponent}>
        <label>{label}</label>
        <select onChange={event => onChange(event.target.value)} value={value}>
            {options.map((option, index) => (
                <option value={option.value} key={index}>{option.label}</option>
            ))}
        </select>
    </div>
    )
}
