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

export const getServerSideProps = async (context) => {
  const { req, query, res, resolvedUrl } = context

  // console.log(req.headers.referer)
  // console.log(`${context.req.headers.host}`)
  // console.log(`${context.req.headers.host}${resolvedUrl}`)

  let returnBody = {
    props: {
      render: {},
      renders: {},
    }
  }
  
  const getRenders = await RenderApiLibrary.getRenders('12')
  const renders = getRenders.data
  returnBody.props.renders = renders;
  if (query?.id) {
    const getRender = await RenderApiLibrary.getRender(query.id)
    if (getRender.data) {
      returnBody.props.render = getRender.data;
    } else {
      const getRandom = await RenderApiLibrary.getRender()
      returnBody.props.render = getRandom.data
      returnBody = {
        redirect: {
          permanent: false,
          // destination: resolvedUrl.split("?")[0],
          destination: '/generate',
        },
      };
    }
  } else {
    const getRender = await RenderApiLibrary.getRender()
    returnBody.props.render = getRender.data;
  }
  return returnBody;
}

export default function Playground(props) {
  const { render, renders } = props
  const router = useRouter()
  const [currentRenders, setCurrentRenders] = useState(renders)
  const [renderCount, setRenderCount] = useState(0)

  const openGraphImage = render.data?.image ? render.data.image : 'https://generations.rod.dev/2f996be4-b935-42db-9d1e-01effabbc5c6.jpg';

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
    <main className={style.GeneratePage}>
        <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description}/>
            <meta name="keywords" content={meta.keywords}/>
            <meta property="og:url" content={`https://rod.dev${router.asPath}`}/>
            <meta property="og:type" content={meta.type}/>
            <meta property="og:site_name" content="Rodrigo Barraza"/>
            <meta property="og:description" content={meta.description}/>
            <meta property="og:title" content={meta.title}/>
            <meta property="og:image" content={openGraphImage} />
            {render.data?.image && (
                <meta property='article:published_time' content={render.data.createdAt}/>
            )}
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <Txt2ImageComponent render={render}/>
        <div className="gallery">
          <div className="sectionTitle">
            <div>Explore {renderCount} Generations</div>
            <div className="refresh" onClick={getRenders}>♻️</div>
          </div>
          { currentRenders.images.map((render, index) => (
            <div key={index} className="gallery-item" onClick={() => goToGeneration(render.id)}>
              <div className="image">
                <div className="overlay">
                  <div className="prompt">{render.prompt}</div>
                </div>
                <img src={render.image}></img>
              </div>
              {/* <div className="miniCard">
                <div className="name">Generated Image #{render.count}</div>
                <div className="date">{UtilityLibrary.toHumanDateAndTime(render.createdAt)}</div>
                <div className="prompt">{render.prompt}</div>
                <div className="properties">
                  <div>🖌️ {render.sampler}</div>
                  <div>🎨 {render.style}</div>
                </div>
              </div> */}
            </div>
          ))}
        </div>
    </main>
  )
}
