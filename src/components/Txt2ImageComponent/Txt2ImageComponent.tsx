import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import EventApiLibrary from '../../libraries/EventApiLibrary'
import styles from './Txt2ImageComponent.module.scss'
import InputComponent from '../InputComponent/InputComponent'
import SelectComponent from '../SelectComponent/SelectComponent'
import SliderComponent from '../SliderComponent/SliderComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import StyleCollection from '../../collections/StyleCollection'
import SamplingCollection from '../../collections/SamplingCollection'

export default function Txt2ImageComponent(props: any) {
    const {prompt, style}: {prompt: string, style: string} = props
    const randomStyle = StyleCollection[Math.floor(Math.random() * StyleCollection.length)].value
    const [base64Img, setBase64Img] = useState('')
    const [newPrompt, setNewPrompt] = useState(prompt || '')
    const [sampler, setSampler] = useState(SamplingCollection[0].value)
    const [newStyle, setNewStyle] = useState(style || randomStyle)
    const [cfg, setCfg] = useState(7)
    const [isImageLoading, setIsImageLoading] = useState(true)

    const renderImage = useCallback(() => {
        const fullPrompt = `${newStyle}, ${newPrompt}`
        const negativePrompt = StyleCollection.find((styleOption) => styleOption.value === newStyle).negativePrompt
        setIsImageLoading(true)
        EventApiLibrary.postRender(fullPrompt, sampler, cfg, negativePrompt)
        .then(response => response.text())
        .then(result => {
            setBase64Img(`data:image/jpeg;base64,${JSON.parse(result).data}`)
            setIsImageLoading(false)
        })
        .catch(error => console.log('error', error));
    },[newStyle, newPrompt, sampler, cfg])

    useEffect(() => {
        renderImage()
    }, [])

    function submitForm(event) {
        event.preventDefault()
        renderImage()
    }

    return (
        <div className={styles.Txt2ImageComponent}>
            <form onSubmit={(event)=> submitForm(event)}>
                {/* {isImageLoading && <div className="loading">LOADING...</div>} */}
                <div className="Card">
                    <h1>Generate an image from text</h1>
                    {/* <p>Trained on 55,000 images</p> */}
                    <InputComponent 
                    label="Prompt"
                    type="text"
                    value={newPrompt} 
                    onChange={setNewPrompt}
                    ></InputComponent>
                    <SelectComponent 
                    label="Sampler"
                    value={sampler} 
                    options={SamplingCollection}
                    onChange={setSampler}
                    ></SelectComponent>
                    <SliderComponent 
                    label="Contrast"
                    value={cfg} 
                    onChange={setCfg}
                    ></SliderComponent>
                    <SelectComponent 
                    label="Style"
                    value={newStyle} 
                    options={StyleCollection}
                    onChange={setNewStyle}
                    ></SelectComponent>
                    <ButtonComponent 
                    label="Generate"
                    type="submit" 
                    disabled={isImageLoading}
                    ></ButtonComponent>
                </div>
                <picture className={isImageLoading ? 'loading' : ''}>
                    <img className={isImageLoading ? 'loading' : ''} src={base64Img} alt="">
                    </img>
                </picture>
            </form>
        </div>
    )
}
