import React from 'react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { InferGetServerSidePropsType, GetServerSideProps  } from 'next'
import { useRouter } from 'next/router'
import PromptCollection from '../../collections/PromptCollection'
import Txt2ImageComponent from '../../components/Txt2ImageComponent/Txt2ImageComponent'
import style from './index.module.scss'
import EventApiLibrary from '../../libraries/EventApiLibrary'

export const getServerSideProps = async (context) => {
  const { req, query, res, resolvedUrl } = context

  let render = {};
  // console.log(req.headers.referer)
  // console.log(`${context.req.headers.host}`)
  // console.log(`${context.req.headers.host}${resolvedUrl}`)

  if (query?.id) {
    const getRenderNew = await EventApiLibrary.getRenderNew(query.id)
    if (getRenderNew.data) {
      const result = await getRenderNew.data.text()
      render = JSON.parse(result)
      return { props: { render } };
    } else {
      const getRandomNew = await EventApiLibrary.getRenderNew()
      const result = await getRandomNew.data.text()
      render = JSON.parse(result)
      return {
        props: { render },
        redirect: {
          permanent: false,
          destination: resolvedUrl.split("?")[0],
        },
      };
    }
  } else {
    return { props: { render } };
  }
}

export default function Playground(props) {
  const { render } = props
  const router = useRouter()

  const openGraphImage = render.data?.image ? render.data.image : 'https://generations.rod.dev/2f996be4-b935-42db-9d1e-01effabbc5c6.jpg';

  const meta = {
      title: 'Rodrigo Barraza - Text to Image: AI Image Generation',
      description: "Try out Rodrigo Barraza's text-to-image AI image generation realism-model, trained on more than 120,000 images, photographs and captions.",
      keywords: 'generate, text, text to image, text to image generator, text to image ai, ai image, rodrigo barraza',
      type: 'website',
  }

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
        <Txt2ImageComponent/>
    </main>
  )
}
