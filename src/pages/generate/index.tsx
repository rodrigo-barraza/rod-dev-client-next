import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import PromptCollection from '../../collections/PromptCollection'
import Txt2ImageComponent from '../../components/Txt2ImageComponent/Txt2ImageComponent'

export default function Playground() {
  const router = useRouter()
  const randomPrompt = PromptCollection[Math.floor(Math.random() * PromptCollection.length)].prompt
  const meta = {
      title: 'Generate an image from text',
      description: "Try out Rodrigo Barraza's text-to-image realism-model, trained on more than 120,000 images, photographs and captions.",
      keywords: 'generate, text, text to image, text to image generator, text to image ai',
      type: 'website',
  }
  return (
    <div>
        <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description}/>
            <meta name="keywords" content={meta.keywords}/>
              <meta property="og:url" content={`https://rod.dev${router.asPath}`}/>
            <meta property="og:type" content={meta.type}/>
            <meta property="og:site_name" content="Rodrigo Barraza"/>
            <meta property="og:description" content={meta.description}/>
            <meta property="og:title" content={meta.title}/>
            {meta.date && (
                <meta property='article:published_time' content={meta.date}/>
            )}
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <Txt2ImageComponent prompt={randomPrompt}/>
    </div>
  )
}