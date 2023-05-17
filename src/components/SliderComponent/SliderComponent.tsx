import React from 'react'
import { useEffect, useRef } from 'react'
import style from './SliderComponent.module.scss'

export default function SliderComponent(props: any) {
    const {label, value, onChange}: {label: string, value: string, onChange: any} = props

    const inputReference = useRef(null)

    useEffect(() => {
        const inputElement: Element = inputReference.current
        if (inputElement) {
            inputElement.oninput = function() {
                console.log('fire')
                var value = (this.value-this.min)/(this.max-this.min)*100
                this.style.background = 'linear-gradient(to right, #2c75fd 0%, #2c75fd ' + value + '%, #d3d3d3 ' + value + '%, #d3d3d3 100%)'
            };
        }
    }, [inputReference])

    return (
        <div className={style.SliderComponent}>
        <label>{label}</label>
            <input ref={inputReference} id="myinput" type="range" min="5" max="9" value={value} onChange={event => onChange(event.target.value)}/>
        </div>
    )
}
