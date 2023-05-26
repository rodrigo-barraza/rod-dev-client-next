import React from 'react'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import PromptCollection from '../../collections/PromptCollection'
import Txt2ImageComponent from '../../components/Txt2ImageComponent/Txt2ImageComponent'
import style from './index.module.scss'
import RenderApiLibrary from '../../libraries/RenderApiLibrary'
import FavoriteApiLibrary from '../../libraries/FavoriteApiLibrary'
import UtilityLibrary from '../../libraries/UtilityLibrary'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { usePathname } from 'next/navigation';
import InputComponent from '../../components/InputComponent/InputComponent'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import LikeApiLibrary from '../../libraries/LikeApiLibrary'
import { debounce, filter } from 'lodash'

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { req, query, res, resolvedUrl } = context

  let returnBody = {
      props: {
          meta: {},
      }
  }

  returnBody.props.meta = {
      title: 'Text to Image - Your Likes',
      description: "Try out Rodrigo Barraza's text-to-image AI image generation realism-model, trained on more than 120,000 images, photographs and captions.",
      keywords: 'generate, text, text to image, text to image generator, text to image ai, ai image, rodrigo barraza',
      type: 'website',
      image: 'https://renders.rod.dev/f377bd59-49d6-4858-91df-3c0a6456c5e2.jpg',
  }

  return returnBody;
}

export default function Renders(props) {
  const { meta } = props
  const router = useRouter()
  const currentPage = usePathname()
  const [currentRenders, setCurrentRenders] = useState([])
  const [isSharing, setIsSharing] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState({})

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

  const filteredCurrentRenders = rendersFilter(currentRenders.images);

  // END SEARCHING

  async function deleteRender(id) {
    const deleteRender = await RenderApiLibrary.deleteRender(id);
    if (deleteRender.data.success) {
      getLikedRenders();
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

  async function getLikedRenders() {
    const getLikedRenders = await RenderApiLibrary.getLikedRenders()
    setCurrentRenders(getLikedRenders.data)
  }

  async function postFavorite(render) {
    if (!render.favorite) {
      const postFavorite = await FavoriteApiLibrary.postFavorite(render.id)
      if (postFavorite.data) {
        getLikedRenders()
      }
    } else {
      const deleteFavorite = await FavoriteApiLibrary.deleteFavorite(render.id)
      if (deleteFavorite.data) {
        getLikedRenders()
      }
    }
  }

  async function likeRender(id, like) {
    if (!like) {
        const postLike = await LikeApiLibrary.postLike(id)
        if (postLike.data) {
            setTimeout(function () {
                getLikedRenders()
            }, 300);
        }
    } else {
        const postDelete = await LikeApiLibrary.deleteLike(id)
        if (postDelete.data) {
            setTimeout(function () {
                getLikedRenders()
            }, 300);
        }
    }
  }

  useEffect(() => {
    getLikedRenders();
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
        <div className="gallery">
          <div className="details">
              <div className="container column">
                  <h1>Your Likes</h1>
                  <p>text-to-image AI generations</p>
                  <p>A collection of liked AI-generated images</p>
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
              <picture className="image">
                  { !render.likes ? (
                        <div className={`action ${render.like ? 'liked' : ''}`} onClick={()=>likeRender(render.id, render.like)}><span className="icon">{render.like ? '❤️' : '🤍'}</span></div>
                    ) : (
                        <div className={`action ${render.like ? 'liked' : ''}`} onClick={()=>likeRender(render.id, render.like)}><span className="icon">{render.like ? '❤️' : '🤍'}</span> {render.likes} {render.likes == 1 ? 'like' : 'likes'}</div>
                    )}
                  <img src={render.image}></img>
              </picture>
              <div className="card">

                  { isDeleting[render.id] && (
                    <div className="delete">
                      <div className="label">Are you sure you want to delete this?</div>	
                      <div className="buttons">
                          <ButtonComponent 
                          className="secondary"
                          label="Cancel"
                          type="button" 
                          onClick={() => cancelDeleteRender(render.id)}
                          ></ButtonComponent>
                          <ButtonComponent 
                          className="secondary red"
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
                      label="Load"
                      type="button" 
                      onClick={() => goToGeneration(render.id)}
                      ></ButtonComponent>
                      {/* <ButtonComponent 
                      className="secondary red"
                      label="Delete"
                      type="button"
                      disabled={isDeleting[render.id]}
                      onClick={() => startDeleteRender(render.id)}
                      ></ButtonComponent> */}
                  </div>
              </div>
            </div>
          </div>
            ))}
        </div>
    </main>
  )
}
