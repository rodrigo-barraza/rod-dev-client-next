import React from 'react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Txt2ImageComponent from '@/components/Txt2ImageComponent/Txt2ImageComponent'
import style from './index.module.scss'
import RenderApiLibrary from '@/libraries/RenderApiLibrary'
import GuestApiLibrary from '@/libraries/GuestApiLibrary'
import GenerateHeaderComponent from '@/components/GenerateHeaderComponent/GenerateHeaderComponent'
import GalleryComponent from '@/components/GalleryComponent/GalleryComponent'
import PaginationComponent from '@/components/PaginationComponent/PaginationComponent'
import Link from 'next/link'

export const getServerSideProps = async (context) => {
  const { req, query, res, resolvedUrl } = context

  let returnBody = {
    props: {
      render: {},
      randomRenders: {},
      meta: {},
      guest: {},
    }
  }
  
  const getRenders = await RenderApiLibrary.getRenders('240')
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
          destination: '/generate',
        },
      };
    }
  } else {
    const getRender = await RenderApiLibrary.getRender()
    returnBody.props.render = getRender.data;
  }
  returnBody.props.meta = {
    url: `https://rod.dev${resolvedUrl}`,
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
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(12)

  async function getCount() {
    const count = await RenderApiLibrary.getCount()
    setRenderCount(count.data.count)
  }

  async function getRenders() {
    const getRenders = await RenderApiLibrary.getRenders('1', 'user');
    setRenders(getRenders.data.images);
  }

  async function getRandomRenders() {
    const getRandomRenders = await RenderApiLibrary.getRenders('24');
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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredCurrentRenders = exploreRenders;
  const filteredCurrentRendersList = filteredCurrentRenders?.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main className={style.GeneratePage}>
        <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description}/>
            <meta name="keywords" content={meta.keywords}/>
            <meta property="og:url" content={meta.url}/>
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
            <meta name="twitter:url" content={meta.url}/>
            <meta name="twitter:image" content={meta.image}/>
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        
        <GenerateHeaderComponent guest={theGuest} renders={renders} />
        <Txt2ImageComponent render={render} setGuest={setGuest}/>
        <div className="gallery">
          <div className="sectionTitle">
            <div>Explore {renderCount} Renders</div>
          </div>

          <PaginationComponent 
          postsPerPage={postsPerPage} 
          totalPosts={filteredCurrentRenders?.length} 
          paginate={paginate} 
          currentPage={currentPage}/>
          <GalleryComponent renders={filteredCurrentRendersList} mode='grid' />
        </div>
    </main>
  )
}
