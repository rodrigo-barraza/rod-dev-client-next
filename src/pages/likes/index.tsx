import React from 'react'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { debounce, filter } from 'lodash'
import GuestApiLibrary from '@/libraries/GuestApiLibrary'
import RenderApiLibrary from '@/libraries/RenderApiLibrary'
import GenerateHeaderComponent from '@/components/GenerateHeaderComponent/GenerateHeaderComponent'
import style from './index.module.scss'
import PaginationComponent from '@/components/PaginationComponent/PaginationComponent'
import GalleryComponent from '@/components/GalleryComponent/GalleryComponent'
import FilterComponent from '@/components/FilterComponent/FilterComponent'

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { req, query, res, resolvedUrl } = context

  let returnBody = {
      props: {
          meta: {},
          guest: {}
      }
  }

  returnBody.props.meta = {
      url: `https://rod.dev${resolvedUrl}`,
      title: 'Text to Image - Your Likes',
      description: "Try out Rodrigo Barraza's text-to-image AI image generation realism-model, trained on more than 120,000 images, photographs and captions.",
      keywords: 'generate, text, text to image, text to image generator, text to image ai, ai image, rodrigo barraza',
      type: 'website',
      image: 'https://renders.rod.dev/f377bd59-49d6-4858-91df-3c0a6456c5e2.jpg',
  }

  const forwarded = req.headers["x-forwarded-for"]
  const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
  const getGuest = await GuestApiLibrary.getGuest(ip)
  if (getGuest.data) {
    returnBody.props.guest = getGuest.data;
  }

  return returnBody;
}

export default function Renders(props) {
  const { meta, guest } = props
  const router = useRouter()
  const [likedRenders, setLikedRenders] = useState([])
  const [currentRenders, setCurrentRenders] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [guestData, setGuestData] = useState(guest)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(12)
  const [galleryMode, setGalleryMode] = useState('grid')

  async function getRenders() {
    const getRenders = await RenderApiLibrary.getRenders('12', 'user')
    setCurrentRenders(getRenders.data.images)
  }
  async function getGuest() {
    const getGuest = await GuestApiLibrary.getGuest()
    if (getGuest.data) {
      setGuestData(getGuest.data);
    }
  }

  useEffect(() => {
    getRenders()
  }, [])

  // START SEARCHING

  const rendersFilter = (array) => {
    if (array && array.length) {
      const filteredArray =  array.filter((item) => {
        if (filter === 'favorites') {
          return item.prompt.toLowerCase().includes(debouncedSearch.toLowerCase()) && 
          item.favorite === true
        } if (filter === 'unfavorites') {
          return item.prompt.toLowerCase().includes(debouncedSearch.toLowerCase()) && 
          item.favorite === false
        } else {
          return item.prompt.toLowerCase().includes(debouncedSearch.toLowerCase())
        }
      });
      if (sort === 'oldest') {
        return filteredArray.reverse();
      }
      return filteredArray;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter])

  useEffect(() => {
    const debouncedSearchValue = debounce((value) => {
      setCurrentPage(1);
      setDebouncedSearch(value);
    }, 600);
  
    debouncedSearchValue(search);
  
    // Cleanup function to cancel debounce in case of unmounting while waiting for execution
    return () => {
      debouncedSearchValue.cancel();
    };
  }, [search]);

  function goToGeneration(id) {
    if (id) {
      router.push({
        pathname: '/generate',
        query: { id: id },
      })
    } else {
      router.push({
        pathname: '/generate',
      })
    }
  }

  async function getLikedRenders() {
    const getLikedRenders = await RenderApiLibrary.getLikedRenders()
    setLikedRenders(getLikedRenders.data.images)
    if (!getLikedRenders.data.images.length) {
      goToGeneration()
    }
  }

  useEffect(() => {
    getLikedRenders();
  }, [])

  
  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredCurrentRenders = rendersFilter(likedRenders);
  const filteredCurrentRendersList = filteredCurrentRenders?.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main className={style.RendersPage}>
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
          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:title" content={meta.title}/>
          <meta name="twitter:site" content="@rawdreygo"/>
          <meta name="twitter:url" content={meta.url}/>
          <meta name="twitter:image" content={meta.image}/>
          <link rel="icon" href="/images/favicon.ico" />
      </Head>
      
      <GenerateHeaderComponent guest={guestData} renders={currentRenders} />
        <div className="gallery">
          <div className="details">
              <div className="container column">
                  <h1>Your Likes</h1>
                  <p>text-to-image AI generations</p>
                  <p>A collection of liked AI-generated images</p>
              </div>
          </div>
          
          <FilterComponent setSearch={setSearch} setFilter={setFilter} setSort={setSort} setGalleryMode={setGalleryMode} search={search} filter={filter} sort={sort}/>
          <PaginationComponent postsPerPage={postsPerPage} totalPosts={filteredCurrentRenders?.length} paginate={paginate} currentPage={currentPage}/>
          <GalleryComponent renders={filteredCurrentRendersList} getRenders={getRenders} getGuest={getGuest} mode={galleryMode} />
          <PaginationComponent postsPerPage={postsPerPage} totalPosts={filteredCurrentRenders?.length} paginate={paginate} currentPage={currentPage}/>
        </div>
    </main>
  )
}
