import React from 'react'
import style from './TextAreaComponent.module.scss'

export default function TextAreaComponent(props: any) {
    const {label, value, onChange, onKeyDown}: {label: string, value: string, onChange: any, onKeyDown: any} = props
    return (
    <div className={style.TextAreaComponent}>
        <label>{label}</label>
        <textarea value={value} onChange={event => onChange(event.target.value)} onKeyDown={event => onKeyDown(event)}></textarea>
    </div>
    )
}
