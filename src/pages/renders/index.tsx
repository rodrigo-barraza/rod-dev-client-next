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
import InputComponent from '../../components/InputComponent/InputComponent'
import { debounce } from 'lodash'

export const getServerSideProps = async (context) => {
  const { req, query, res, resolvedUrl } = context

    let returnBody = {
        props: {}
    }
    return returnBody;
}

export default function Renders(props) {
  // const { renders } = props
  const router = useRouter()
  const currentPage = usePathname()
  const [currentRenders, setCurrentRenders] = useState([])
  const [isSharing, setIsSharing] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState({})

  const searchFilter = (array) => {
    if (array && array.length) {
      return array.filter((item) =>
        item.prompt.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
  };

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

  useEffect(() => {
    const debouncedSearchValue = debounce((value) => {
      setDebouncedSearch(value);
      console.log('fire')
    }, 600);
  
    debouncedSearchValue(search);
  
    // Cleanup function to cancel debounce in case of unmounting while waiting for execution
    return () => {
      debouncedSearchValue.cancel();
    };
  }, [search]);

  const filteredCurrentRenders = searchFilter(currentRenders.images);

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

  async function getRenders() {
    const getRenders = await RenderApiLibrary.getRenders('12', 'user')
    setCurrentRenders(getRenders.data)
  }

  useEffect(() => {
    getRenders();
  }, [])

  return (
    <main className={style.RendersPage}>
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
              </div>
            </div>
          </div>
          { filteredCurrentRenders?.map((render, index) => (
          <div key={index} className="item">
            <div className="container">
              <picture className="image">
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
                      label="Load"
                      type="button" 
                      onClick={() => goToGeneration(render.id)}
                      ></ButtonComponent>
                      <ButtonComponent 
                      className="secondary red"
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
