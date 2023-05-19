import React from 'react'
import { useEffect, useRef } from 'react'
import style from './SliderComponent.module.scss'

export default function SliderComponent(props: any) {
    const {label, value, onChange}: {label: string, value: number, onChange: any} = props

    const inputReference: any = useRef({})
    
    useEffect(() => {
        const inputElement: any = inputReference.current
        var val = (value - inputElement.min)/(inputElement.max - inputElement.min) * 100
        inputElement.style.background = 'linear-gradient(to right, #2c75fd 0%, #2c75fd ' + val + '%, #d3d3d3 ' + val + '%, #d3d3d3 100%)'
    }, [value])

    return (
        <div className={style.SliderComponent}>
        <label>{label}</label>
            <input ref={inputReference} type="range" min="5" max="9" value={value} onChange={event => onChange(event.target.value)}/>
        </div>
    )
}
