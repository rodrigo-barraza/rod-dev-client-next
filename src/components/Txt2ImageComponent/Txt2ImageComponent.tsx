import { useState, useEffect, useCallback, useRef } from 'react'
import React from 'react'
import EventApiLibrary from '../../libraries/EventApiLibrary'
import styles from './Txt2ImageComponent.module.scss'
import InputComponent from '../InputComponent/InputComponent'
import SelectComponent from '../SelectComponent/SelectComponent'
import SliderComponent from '../SliderComponent/SliderComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import TextAreaComponent from '../TextAreaComponent/TextAreaComponent'
import StyleCollection from '../../collections/StyleCollection'
import SamplerCollection from '../../collections/SamplerCollection'
import UtilityLibrary from '../../libraries/UtilityLibrary'
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

export default function Txt2ImageComponent(props: any) {
    const {prompt, style}: {prompt: string, style: string} = props
    const router = useRouter()
    const currentPage = usePathname()
    // const randomStyle = StyleCollection[Math.floor(Math.random() * StyleCollection.length)].value
    const [image, setImage] = useState('')
    const [newPrompt, setNewPrompt] = useState('')
    const [sampler, setSampler] = useState(SamplerCollection[0].value)
    const [newStyle, setNewStyle] = useState('')
    const [cfg, setCfg] = useState(7)
    const [date, setDate] = useState('')
    const [isImageLoading, setIsImageLoading] = useState(false)
    const [generatedImageTitle, setGeneratedImageTitle] = useState('Generated Image #')
    const [generatedImageDescription, setGeneratedImageDescription] = useState('')
    const [generatedImageSampler, setGeneratedImageSampler] = useState('')
    const [generatedImageStyle, setGeneratedImageStyle] = useState('')
    const [generatedImageId, setGeneratedImageId] = useState('')
    const [isSharing, setIsSharing] = useState(false)
    const [imageBlur, setImageBlur] = useState(false)
    const formReference = useRef(null)

    const renderImage = useCallback(() => {
        const fullPrompt = `${newStyle}${newStyle ? ', ' : ''}${newPrompt}`
        // const negativePrompt = StyleCollection.find((styleOption) => styleOption.value === newStyle).negativePrompt
        setIsImageLoading(true)
        EventApiLibrary.postRender(newPrompt, sampler, cfg, newStyle, '')
        .then(response => response.text())
        .then(result => {
            const parsedResult = JSON.parse(result)
            const samplerLabel = `🖌️ ${SamplerCollection.find((samplerOption) => samplerOption.value === parsedResult.data.sampler).label}`
            let styleLabel
            const currentStyle = StyleCollection.find((styleOption) => styleOption.value === parsedResult.data.style)
            if (currentStyle && currentStyle.label != 'None') {
                styleLabel = `🎨 ${currentStyle.label}`
            }
            setImage(parsedResult.data.image)
            setImageBlur(true)
            setGeneratedImageId(parsedResult.data.count)
            setGeneratedImageTitle(`Generated Image #${parsedResult.data.count}`)
            setGeneratedImageDescription(newPrompt)
            setDate(UtilityLibrary.toHumanDateAndTime(parsedResult.data.createdAt))
            setGeneratedImageSampler(samplerLabel)
            setGeneratedImageStyle(styleLabel)

            setIsImageLoading(false)

            
            const timeoutTimer = setTimeout(function () {
                setImageBlur(false)
                clearTimeout(timeoutTimer)
            }, 1000);

        })
        .catch(error => console.log('error', error));
    },[newStyle, newPrompt, sampler, cfg])

    useEffect(() => {
        let url = new URL(window.location.href)
        let params = new URLSearchParams(url.search);
        let sourceid = params.get('id')
        EventApiLibrary.getRender(sourceid)
        .then(response => response.text())
        .then(result => {
            const parsedResult = JSON.parse(result)
            const samplerLabel = `🖌️ ${SamplerCollection.find((samplerOption) => samplerOption.value === parsedResult.data.sampler).label}`
            let styleLabel
            const currentStyle = StyleCollection.find((styleOption) => styleOption.value === parsedResult.data.style)
            if (currentStyle && currentStyle.label != 'None') {
                styleLabel = `🎨 ${currentStyle.label}`
            }
            setImage(parsedResult.data.image)
            setGeneratedImageId(parsedResult.data.count)
            setGeneratedImageTitle(`Generated Image #${parsedResult.data.count}`)
            setGeneratedImageDescription(parsedResult.data.prompt)
            setDate(UtilityLibrary.toHumanDateAndTime(parsedResult.data.createdAt))
            setGeneratedImageSampler(samplerLabel)
            setGeneratedImageStyle(styleLabel)
            
            setNewPrompt(parsedResult.data.prompt)
            setNewStyle(parsedResult.data.style)
            setCfg(parsedResult.data.cfg)
            setSampler(parsedResult.data.sampler)
            setIsImageLoading(false)

        })
        .catch(error => console.log('error', error));
    }, [])

    function onTextAreaComponentChange(event: any) {
        if(event.keyCode == 13 && event.shiftKey == false) {
            submitForm(event);
          }
    }

    function submitForm(event: any) {
        event.preventDefault()
        renderImage()
    }

    function downloadOnClick() {
        var a = document.createElement("a");
        a.href = image
        a.download = `rod.dev ${generatedImageTitle}.png`;
        a.click();
    }

    function shareOnClick() {
        setIsSharing(true)
        const shareLink = `${window.location.origin}${currentPage}?id=${generatedImageId}`
        navigator.clipboard.writeText(shareLink);
        
        const timeoutTimer = setTimeout(function () {
            setIsSharing(false)
            clearTimeout(timeoutTimer)
        }, 1000);

    }

    return (
        <div className={styles.Txt2ImageComponent}>
            <div className="Card Interface">
                <h1>Generate an image from text</h1>
                <p>Try out Rodrigo Barraza&apos;s text-to-image realism-model, trained on more than 120,000 images, photographs and captions.</p>
                
                <form onSubmit={(event)=> submitForm(event)} ref={formReference}>
                    <TextAreaComponent
                    label="Prompt"
                    value={newPrompt} 
                    onChange={setNewPrompt}
                    onKeyDown={onTextAreaComponentChange}>
                    </TextAreaComponent>
                    {/* <InputComponent 
                    label="Prompt"
                    type="text"
                    value={newPrompt} 
                    onChange={setNewPrompt}
                    ></InputComponent> */}
                    <SelectComponent 
                    label="Sampler"
                    value={sampler} 
                    options={SamplerCollection}
                    onChange={setSampler}
                    ></SelectComponent>
                    <SliderComponent 
                    label="Strength"
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
                </form>
                
            </div>
            <div className={`Card Label${image && !isImageLoading ? '' : ' loading'}`}>
                <h1>{generatedImageTitle}</h1>
                <p className="date">{date}</p>
                <p className="description">{generatedImageDescription}</p>
                <div className="properties">
                    <p className="sampler">{generatedImageSampler}</p>
                    { generatedImageStyle && (
                        <p className="style">{generatedImageStyle}</p>
                    )}
                </div>
                <ButtonComponent 
                className="secondary"
                label="Share"
                type="button" 
                onClick={shareOnClick}
                ></ButtonComponent>
                <ButtonComponent 
                className="secondary"
                label="Download"
                type="button" 
                onClick={downloadOnClick}
                ></ButtonComponent>
            </div>
            <picture className={isImageLoading ? 'loading' : ''}>
                <img className={`${isImageLoading ? 'loading' : ''} ${imageBlur ? 'blur' : ''}`} src={image} alt={newPrompt}>
                </img>
            </picture>
            { isSharing && (
                <div className="test">Copied Link!</div>
            )}
            { isImageLoading && (
                <div className="test">Generate</div>
            )}
        </div>
    )
}
