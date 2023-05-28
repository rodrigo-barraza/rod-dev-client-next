import React from 'react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { InferGetServerSidePropsType, GetServerSideProps  } from 'next'
import { useRouter } from 'next/router'
import PromptCollection from '@/collections/PromptCollection'
import Txt2ImageComponent from '@/components/Txt2ImageComponent/Txt2ImageComponent'
import style from './index.module.scss'
import RenderApiLibrary from '@/libraries/RenderApiLibrary'
import GuestApiLibrary from '@/libraries/GuestApiLibrary'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import GenerateHeaderComponent from '@/components/GenerateHeaderComponent/GenerateHeaderComponent'

export const getServerSideProps = async (context) => {
  const { req, query, res, resolvedUrl } = context

  // console.log(req.headers.referer)
  // console.log(`${context.req.headers.host}`)
  // console.log(`${context.req.headers.host}${resolvedUrl}`)

  let returnBody = {
    props: {
      render: {},
      randomRenders: {},
      meta: {},
      guest: {},
    }
  }
  
  const getRenders = await RenderApiLibrary.getRenders('12')
  const randomRenders = getRenders.data.images
  returnBody.props.randomRenders = randomRenders;
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
  returnBody.props.meta = {
    title: 'Rodrigo Barraza - Text to Image: AI Image Generation',
    description: "Try out Rodrigo Barraza's text-to-image AI image generation realism-model, trained on more than 120,000 images, photographs and captions.",
    keywords: 'generate, text, text to image, text to image generator, text to image ai, ai image, rodrigo barraza',
    type: 'website',
    image: returnBody.props.render?.image ? returnBody.props.render.image : 'https://renders.rod.dev/2f996be4-b935-42db-9d1e-01effabbc5c6.jpg',
    url: `https://rod.dev${resolvedUrl}`,
  }

  const forwarded = req.headers["x-forwarded-for"]
  const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
  const getGuest = await GuestApiLibrary.getGuest(ip)
  if (getGuest.data) {
    returnBody.props.guest = getGuest.data;
  }

  return returnBody;
}

export default function Playground(props) {
  const { render, randomRenders, meta, guest } = props
  const router = useRouter()
  const [exploreRenders, setExploreRenders] = useState(randomRenders)
  const [renders, setRenders] = useState([])
  const [renderCount, setRenderCount] = useState(0)
  const [theGuest, setGuest] = useState(guest)

  function goToGenerate(id) {
    router.push({
      pathname: '/generate',
      query: { id: id },
    })
  }

  function goToRenders() {
    router.push({
      pathname: '/renders'
    })
  }

  function goToLikes() {
    router.push({
      pathname: '/likes'
    })
  }

  async function getCount() {
    const count = await RenderApiLibrary.getCount()
    setRenderCount(count.data.count)
  }

  async function getRenders() {
    const getRenders = await RenderApiLibrary.getRenders('1', 'user');
    setRenders(getRenders.data.images);
  }

  async function getRandomRenders() {
    const getRandomRenders = await RenderApiLibrary.getRenders('12');
    setExploreRenders(getRandomRenders.data.images);
  }

  async function getGuest() {
    const getGuest = await GuestApiLibrary.getGuest()
    if (getGuest.data) {
      setGuest(getGuest.data)
    }
  }

  useEffect(() => {
    getGuest()
    getCount()
    getRenders()
  }, [render])

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
            <meta property="og:image" content={meta.image} />
            {render?.image && (
                <meta property='article:published_time' content={render.createdAt}/>
            )}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={meta.title}/>
            <meta name="twitter:site" content="@rawdreygo"/>
            <meta name="twitter:url" content={`https://rod.dev${router.asPath}`}/>
            <meta name="twitter:image" content={meta.image}/>
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        
        <GenerateHeaderComponent guest={theGuest} renders={renders} />
        <Txt2ImageComponent render={render} setGuest={setGuest}/>
        <div className="gallery">
          <div className="sectionTitle">
            <div>Explore {renderCount} Renders</div>
            <div className="refresh" onClick={getRandomRenders}>♻️</div>
          </div>
          { exploreRenders.map((render, index) => (
            <div key={index} className="gallery-item" onClick={() => goToGenerate(render.id)}>
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
