import React from 'react'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { usePathname } from 'next/navigation';
import { debounce } from 'lodash'
import RenderApiLibrary from '@/libraries/RenderApiLibrary'
import FavoriteApiLibrary from '@/libraries/FavoriteApiLibrary'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'
import InputComponent from '@/components/InputComponent/InputComponent'
import SelectComponent from '@/components/SelectComponent/SelectComponent'
import GenerateHeaderComponent from '@/components/GenerateHeaderComponent/GenerateHeaderComponent'
import LikeApiLibrary from '@/libraries/LikeApiLibrary'
import GuestApiLibrary from '@/libraries/GuestApiLibrary'
import BadgeComponent from '@/components/BadgeComponent/BadgeComponent'
import style from './index.module.scss'

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { req, query, res, resolvedUrl } = context

  let returnBody = {
      props: {
          meta: {},
          guest: {},
      }
  }

  returnBody.props.meta = {
      title: 'Text to Image - Your Renders',
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
  const currentPage = usePathname()
  const [currentRenders, setCurrentRenders] = useState([])
  const [isSharing, setIsSharing] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState({})
  const [guestData, setGuestData] = useState(guest)

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'favorites', label: 'Favorites' },
    { value: 'unfavorites', label: 'Unfavorites' },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ]

  // START FILTERING



  // END FILTERING

  useEffect(() => {
  }, [sort])

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

  const searchFilter = (array) => {
    if (array && array.length) {
      return array.filter((item) => {
        return item.prompt.toLowerCase().includes(debouncedSearch.toLowerCase())
      });
    }
  };

  const favoritesFilter = (array) => {
    if (array && array.length) {
      return array.filter((item) => {
        if (filter === 'favorites') {
          return item.favorite === true
        } else {
          return item;
        }
      });
    }
  };

  useEffect(() => {
    const debouncedSearchValue = debounce((value) => {
      setDebouncedSearch(value);
    }, 600);
  
    debouncedSearchValue(search);
  
    // Cleanup function to cancel debounce in case of unmounting while waiting for execution
    return () => {
      debouncedSearchValue.cancel();
    };
  }, [search]);

  const filteredCurrentRenders = rendersFilter(currentRenders);

  // END SEARCHING

  async function deleteRender(id) {
    const deleteRender = await RenderApiLibrary.deleteRender(id);
    if (deleteRender.data.success) {
      getRenders();
    }
  }

  async function startDeleteRender(id) {
    const deleteObject = { ...isDeleting };
    deleteObject[id] = true;
    setIsDeleting(deleteObject);
  }

  async function cancelDeleteRender(id) {
    const deleteObject = { ...isDeleting };
    deleteObject[id] = false;
    setIsDeleting(deleteObject);
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
      const shareLink = `${window.location.origin}/generate?id=${generation.id}`
      navigator.clipboard.writeText(shareLink);
      
      const timeoutTimer = setTimeout(function () {
          setIsSharing(false)
          clearTimeout(timeoutTimer)
      }, 1000);
  }

  async function getRenders() {
    const getRenders = await RenderApiLibrary.getRenders('12', 'user')
    setCurrentRenders(getRenders.data.images)
  }

  async function postFavorite(render) {
    if (!render.favorite) {
      const postFavorite = await FavoriteApiLibrary.postFavorite(render.id)
      if (postFavorite.data) {
        getRenders()
      }
    } else {
      const deleteFavorite = await FavoriteApiLibrary.deleteFavorite(render.id)
      if (deleteFavorite.data) {
        getRenders()
      }
    }
  }

  async function likeRender(id, like) {
    if (!like) {
        const postLike = await LikeApiLibrary.postLike(id)
        if (postLike.data) {
              getRenders()
        }
    } else {
        const postDelete = await LikeApiLibrary.deleteLike(id)
        if (postDelete.data) {
              getRenders()
        }
    }
    getGuest()
  }
  async function getGuest() {
    const getGuest = await GuestApiLibrary.getGuest()
    if (getGuest.data) {
      setGuestData(getGuest.data);
    }
  }

  useEffect(() => {
    getRenders();
  }, [])

  return (
    <main className={style.RendersPage}>
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
          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:title" content={meta.title}/>
          <meta name="twitter:site" content="@rawdreygo"/>
          <meta name="twitter:url" content={`https://rod.dev${router.asPath}`}/>
          <meta name="twitter:image" content={meta.image}/>
          <link rel="icon" href="/images/favicon.ico" />
      </Head>
      
        <GenerateHeaderComponent guest={guestData} renders={currentRenders} />
        <div className="gallery">
          <div className="details">
              <div className="container column">
                  <h1>Your Renders</h1>
                  <p>text-to-image AI generations</p>
                  <p>Your collection of AI-generated images</p>
              </div>
          </div>
          <div className="search">
            <div className="nav container column">
              <div className="CardComponent">
                <InputComponent 
                  label="Search"
                  type="text"
                  value={search} 
                  onChange={setSearch}
                ></InputComponent>
                <SelectComponent 
                  label="Filter"
                  type="text"
                  value={filter} 
                  onChange={setFilter}
                  options={filterOptions}
                ></SelectComponent>
                <SelectComponent 
                  label="Sort"
                  type="text"
                  value={sort} 
                  onChange={setSort}
                  options={sortOptions}
                ></SelectComponent>
              </div>
            </div>
          </div>
          { filteredCurrentRenders?.map((render, index) => (
          <div key={index} className="item">
            <div className="container">
              <picture className="RenderPictureComponent image">
                  { !render.likes ? (
                      <div className={`action ${render.like ? 'liked' : ''}`} onClick={()=>likeRender(render.id, render.like)}><span className="icon">{render.like ? '❤️' : '🤍'}</span></div>
                  ) : (
                      <div className={`action ${render.like ? 'liked' : ''}`} onClick={()=>likeRender(render.id, render.like)}><span className="icon">{render.like ? '❤️' : '🤍'}</span> {render.likes} {render.likes == 1 ? 'like' : 'likes'}</div>
                  )}
                  <img src={render.image}></img>
              </picture>
              {/* <div className="card">

                  { isDeleting[render.id] && (
                    <div className="delete">
                      <div className="label">Are you sure you want to delete this?</div>	
                      <div className="buttons">
                          <ButtonComponent 
                          className=""
                          label="Cancel"
                          type="button" 
                          onClick={() => cancelDeleteRender(render.id)}
                          ></ButtonComponent>
                          <ButtonComponent 
                          className="red"
                          label="Delete"
                          type="button"
                          onClick={() => deleteRender(render.id)}
                          ></ButtonComponent>
                        </div>
                    </div>
                  )}

                  <div className="name">
                    <span className={`favorite ${render.favorite ? 'favorited' : ''}`} onClick={() => postFavorite(render)}>{render.favorite ? '📀' : '💿'}</span>
                    {render.id}
                  </div>
                  <div className="date">{UtilityLibrary.toHumanDateAndTime(render.createdAt)}</div>
                  <div className="properties">
                      <div className="sampler">🖌️ {render.sampler}</div>
                      <div className="style">🎨 {render.style}</div>
                  </div>
                  <div className="prompt">{render.prompt}</div>
                  <div className="buttons">
                      <ButtonComponent 
                      className="mini"
                      label="Share"
                      type="button" 
                      onClick={() => shareGeneration(render)}
                      ></ButtonComponent>
                      <ButtonComponent 
                      className="mini"
                      label="Download"
                      type="button"
                      onClick={() => downloadGeneration(render)}
                      ></ButtonComponent>
                  </div>
                  <div className="buttons">
                      <ButtonComponent 
                      className="mini"
                      label="Load"
                      type="button" 
                      onClick={() => goToGeneration(render.id)}
                      ></ButtonComponent>
                      <ButtonComponent 
                      className="mini red"
                      label="Delete"
                      type="button"
                      disabled={isDeleting[render.id]}
                      onClick={() => startDeleteRender(render.id)}
                      ></ButtonComponent>
                  </div>
              </div> */}
              
              <div className="RenderCardComponent">

                  { isDeleting[render.id] && (
                    <div className="overlay">
                      <div className="label">Are you sure you want to delete this?</div>	
                      <div className="actions">
                          <ButtonComponent 
                          className="mini "
                          label="Cancel"
                          type="button" 
                          onClick={() => cancelDeleteRender(render.id)}
                          ></ButtonComponent>
                          <ButtonComponent 
                          className="mini red"
                          label="Delete"
                          type="button"
                          onClick={() => deleteRender(render.id)}
                          ></ButtonComponent>
                        </div>
                    </div>
                  )}

                  <div className="title">
                    <span className={`favorite ${render.favorite ? 'favorited' : ''}`} onClick={() => postFavorite(render)}>{render.favorite ? '📀' : '💿'}</span>
                    {render.id}
                  </div>
                  <div className="date">{UtilityLibrary.toHumanDateAndTime(render.createdAt)}</div>
                  <div className="badges">
                      <BadgeComponent type="sampler" value={render.sampler}/>
                      <BadgeComponent type="style" value={render.style}/>
                  </div>
                  <div className="description">{render.prompt}</div>
                  <div className="actions">
                      <ButtonComponent 
                      className="mini"
                      label="Share"
                      type="button" 
                      onClick={() => shareGeneration(render)}
                      ></ButtonComponent>
                      <ButtonComponent 
                      className="mini"
                      label="Download"
                      type="button"
                      onClick={() => downloadGeneration(render)}
                      ></ButtonComponent>
                      <ButtonComponent 
                      className="mini"
                      label="Load"
                      type="button" 
                      onClick={() => goToGeneration(render.id)}
                      ></ButtonComponent>
                      <ButtonComponent 
                      className="mini red"
                      label="Delete"
                      type="button"
                      disabled={isDeleting[render.id]}
                      onClick={() => startDeleteRender(render.id)}
                      ></ButtonComponent>
                  </div>
              </div>
            </div>
          </div>
            ))}
        </div>
    </main>
  )
}
