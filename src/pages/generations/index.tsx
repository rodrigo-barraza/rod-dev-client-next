import React from 'react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { InferGetServerSidePropsType, GetServerSideProps  } from 'next'
import { useRouter } from 'next/router'
import PromptCollection from '../../collections/PromptCollection'
import Txt2ImageComponent from '../../components/Txt2ImageComponent/Txt2ImageComponent'
import style from './index.module.scss'
import RenderApiLibrary from '../../libraries/RenderApiLibrary'
import UtilityLibrary from '../../libraries/UtilityLibrary'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { usePathname } from 'next/navigation';

export const getServerSideProps = async (context) => {
  const { req, query, res, resolvedUrl } = context

    let returnBody = {
        props: {
            renders: {},
        }
    }
    const getRenders = await RenderApiLibrary.getRenders('12', 'user')
    const renders = getRenders.data
    returnBody.props.renders = renders;
    return returnBody;
}

export default function Generations(props) {
  const { renders } = props
  const router = useRouter()
  const currentPage = usePathname()
  const [currentRenders, setCurrentRenders] = useState(renders)
  const [renderCount, setRenderCount] = useState(0)
  const [isSharing, setIsSharing] = useState(false)

  console.log(renders)

//   const openGraphImage = render?.image ? render.image : 'https://generations.rod.dev/2f996be4-b935-42db-9d1e-01effabbc5c6.jpg';

  const meta = {
      title: 'Rodrigo Barraza - Text to Image: AI Image Generation',
      description: "Try out Rodrigo Barraza's text-to-image AI image generation realism-model, trained on more than 120,000 images, photographs and captions.",
      keywords: 'generate, text, text to image, text to image generator, text to image ai, ai image, rodrigo barraza',
      type: 'website',
  }

  function goToGeneration(id) {
    router.push({
      pathname: '/generate',
      query: { id: id },
    })
  }

  function downloadGeneration(generation) {
    UtilityLibrary.downloadImage(generation.image, generation.id);
  }

  function shareGeneration(generation) {
      setIsSharing(true)
      const shareLink = `${window.location.origin}${currentPage}?id=${generation.id}`
      navigator.clipboard.writeText(shareLink);
      
      const timeoutTimer = setTimeout(function () {
          setIsSharing(false)
          clearTimeout(timeoutTimer)
      }, 1000);
  }

  async function getCount() {
    const count = await RenderApiLibrary.getCount()
    setRenderCount(count.data.count)
  }

  async function getRenders() {
    const getRenders = await RenderApiLibrary.getRenders('12')
    setCurrentRenders(getRenders.data)
  }

  useEffect(() => {
    getCount()
  }, [])

  return (
    <main className={style.GenerationsPage}>
        {/* <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description}/>
            <meta name="keywords" content={meta.keywords}/>
            <meta property="og:url" content={`https://rod.dev${router.asPath}`}/>
            <meta property="og:type" content={meta.type}/>
            <meta property="og:site_name" content="Rodrigo Barraza"/>
            <meta property="og:description" content={meta.description}/>
            <meta property="og:title" content={meta.title}/>
            <meta property="og:image" content={openGraphImage} />
            {render?.image && (
                <meta property='article:published_time' content={render.createdAt}/>
            )}
            <link rel="icon" href="/images/favicon.ico" />
        </Head> */}
        <div className="sectionTitle">
            <div className="container column">
                <h1>My Generations</h1>
                <p>text-to-image AI generations</p>
                <p>Your collection of AI-generated images</p>
            </div>
        </div>
        <div className="gallery">
            <div className="container column">
            { currentRenders.images.map((render, index) => (
                <div key={index} className="gallery-item">
                    <div className="image">
                        <img src={render.image}></img>
                    </div>
                    <div className="miniCard">
                        <div className="name">{render.id}</div>
                        <div className="date">{UtilityLibrary.toHumanDateAndTime(render.createdAt)}</div>
                        <div className="properties">
                            <div className="sampler">🖌️ {render.sampler}</div>
                            <div className="style">🎨 {render.style}</div>
                        </div>
                        <div className="prompt">{render.prompt}</div>
                        <div className="buttons">
                            <ButtonComponent 
                            className="secondary"
                            label="Share"
                            type="button" 
                            onClick={() => shareGeneration(render)}
                            ></ButtonComponent>
                            <ButtonComponent 
                            className="secondary"
                            label="Download"
                            type="button"
                            onClick={() => downloadGeneration(render)}
                            ></ButtonComponent>
                        </div>
                        <div className="buttons">
                            <ButtonComponent 
                            className="secondary"
                            label="Prompt"
                            type="button" 
                            onClick={() => goToGeneration(render.id)}
                            ></ButtonComponent>
                            <ButtonComponent 
                            className="secondary"
                            label="Delete"
                            type="button" 
                            ></ButtonComponent>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    </main>
  )
}
