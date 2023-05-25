import { useState, useEffect, useCallback, useRef } from 'react'
import React from 'react'
import { InferGetServerSidePropsType, GetServerSideProps  } from 'next'
import EventApiLibrary from '../../libraries/EventApiLibrary'
import RenderApiLibrary from '../../libraries/RenderApiLibrary'
import styles from './Txt2ImageComponent.module.scss'
import InputComponent from '../InputComponent/InputComponent'
import SelectComponent from '../SelectComponent/SelectComponent'
import SliderComponent from '../SliderComponent/SliderComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import TextAreaComponent from '../TextAreaComponent/TextAreaComponent'
import StyleCollection from '../../collections/StyleCollection'
import SamplerCollection from '../../collections/SamplerCollection'
import UtilityLibrary from '../../libraries/UtilityLibrary'
import LikeApiLibrary from '../../libraries/LikeApiLibrary'
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { useContext } from 'react'
import { useAlertContext } from '../../contexts/AlertContext'

export default function Txt2ImageComponent({render}) {
    const router = useRouter();
    const currentPage = usePathname()
    const [image, setImage] = useState('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
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
    const [styleLabelColor, setStyleLabelColor] = useState('black')
    const [isSharing, setIsSharing] = useState(false)
    const [like, setLike] = useState(render.like)
    const formReference = useRef(null)

    const { setMessage } = useAlertContext();

    const renderImage = useCallback(() => {
        setIsImageLoading(true)
        EventApiLibrary.postRender(newPrompt, sampler, cfg, newStyle, '')
        .then(response => response.text())
        .then(result => {
            const parsedResult = JSON.parse(result)
            const samplerResult = SamplerCollection.find((samplerOption) => samplerOption.value === parsedResult.data.sampler);
            const samplerLabel = `🖌️ ${samplerResult.label}`
            let styleLabel
            const currentStyle = StyleCollection.find((styleOption) => styleOption.value === parsedResult.data.style)
            if (currentStyle && currentStyle.label != 'None') {
                styleLabel = `🎨 ${currentStyle.label}`
            }
            setStyleLabelColor(currentStyle.color)
            router.query.id = parsedResult.data.id
            router.push(router)
            setGeneratedImageId(parsedResult.data.id)
            setGeneratedImageTitle(`Generated Image #${parsedResult.data.count}`)
            setGeneratedImageDescription(newPrompt)
            setDate(UtilityLibrary.toHumanDateAndTime(parsedResult.data.createdAt))
            setGeneratedImageSampler(samplerLabel)
            setGeneratedImageStyle(styleLabel)

            const img = new Image()
            img.onload = function () {
                setIsImageLoading(false)
                setImage(parsedResult.data.image)
            }
            img.src = parsedResult.data.image

        })
        .catch(error => console.log('error', error));
    },[newStyle, newPrompt, sampler, cfg])

    useEffect(() => {
        async function getRender() {
            if (render) {
                const samplerLabel = `🖌️ ${SamplerCollection.find((samplerOption) => samplerOption.value === render.sampler).label}`
                let styleLabel
                const currentStyle = StyleCollection.find((styleOption) => styleOption.value === render.style)
                if (currentStyle && currentStyle.label != 'None') {
                    styleLabel = `🎨 ${currentStyle.label}`
                }
                setStyleLabelColor(currentStyle.color)
                setImage(render.image)
                setGeneratedImageId(render.id)
                setGeneratedImageTitle(`Generated Image #${render.count}`)
                setGeneratedImageDescription(render.prompt)
                setDate(UtilityLibrary.toHumanDateAndTime(render.createdAt))
                setGeneratedImageSampler(samplerLabel)
                setGeneratedImageStyle(styleLabel)
                setNewPrompt(render.prompt)
                setNewStyle(render.style)
                setCfg(render.cfg)
                setSampler(render.sampler)
                setIsImageLoading(false)
            }
        }
        getRender()
    }, [render])

    function onTextAreaComponentChange(event: any) {
        if(event.keyCode == 13 && event.shiftKey == false) {
            submitForm(event);
          }
    }

    function submitForm(event: any) {
        event.preventDefault()
        renderImage()
    }

    function downloadGeneration() {
        UtilityLibrary.downloadImage(image, generatedImageTitle);
    }

    async function getRender(id) {
        const getRender = await RenderApiLibrary.getRender(id)
        const render = getRender.data
        if (render) {
            setLike(render.like)
        }
    }

    async function likeRender(id, like) {
        setLike(!like)
        if (!like) {
            const postLike = await LikeApiLibrary.postLike(id)
            if (postLike.data) {
                setTimeout(function () {
                    getRender(id)
                }, 100);
            }
        } else {
            const postDelete = await LikeApiLibrary.deleteLike(id)
            if (postDelete.data) {
                setTimeout(function () {
                    getRender(id)
                }, 100);
            }
        }
    }

    function shareGeneration() {
        setMessage('Copied Link!')
        // setIsSharing(true)
        const shareLink = `${window.location.origin}${currentPage}?id=${generatedImageId}`
        navigator.clipboard.writeText(shareLink);
        
        const timeoutTimer = setTimeout(function () {
            setMessage('')
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
                    className="filled blue"
                    disabled={isImageLoading}
                    ></ButtonComponent>
                </form>
                
            </div>
            <div className={`Card Label${image && !isImageLoading ? '' : ' loading'}`}>
                <h1><span className={`like ${like ? 'liked' : ''}`} onClick={()=>likeRender(render.id, like)}>{like ? '❤️' : '🤍'}</span>{render.id}</h1>
                <p className="date">{date}</p>
                <div className="properties">
                    <p className="sampler">{generatedImageSampler}</p>
                    { generatedImageStyle && (
                        <p className={`style ${styleLabelColor}`} style={{ backgroundColor: styleLabelColor}}>{generatedImageStyle}</p>
                    )}
                </div>
                <p className="description">{generatedImageDescription}</p>
                <p>1 Like</p>
                <ButtonComponent 
                className="secondary"
                label="Buy"
                disabled
                type="button" 
                ></ButtonComponent>
                <ButtonComponent 
                className="secondary"
                label="Share"
                type="button" 
                onClick={shareGeneration}
                ></ButtonComponent>
                <ButtonComponent 
                className="secondary"
                label="Download"
                type="button" 
                onClick={downloadGeneration}
                ></ButtonComponent>
            </div>
            <picture className={isImageLoading ? 'loading' : ''}>
                <img className={`${isImageLoading ? 'loading' : ''}`} src={image} alt={newPrompt}>
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
