import React, { useEffect } from 'react'
import style from './GalleryComponent.module.scss'
import { useState } from 'react';
import { useRouter } from 'next/router';
import LikeApiLibrary from '@/libraries/LikeApiLibrary';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import BadgeComponent from '../BadgeComponent/BadgeComponent';
import RenderApiLibrary from '@/libraries/RenderApiLibrary';
import UtilityLibrary from '@/libraries/UtilityLibrary';
import FavoriteApiLibrary from '@/libraries/FavoriteApiLibrary';

export default function GalleryComponent(props) {
    const router = useRouter()
    const { renders, getRenders, getGuest, mode } = props;
    const [isDeleting, setIsDeleting] = useState({})
    const [isSharing, setIsSharing] = useState(false)

    async function likeRender(id, like) {
        console.log(id, like);
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

    return (
        <div className={`${style.GalleryComponent} ${style[mode]}`}>
            { renders?.map((render, index) => (
                <div key={index} className="item">
                    <div className="container">
                    <picture className="RenderPictureComponent image">
                        { !render.likes ? (
                            <div className={`action ${render.like ? 'liked' : ''}`} onClick={()=>likeRender(render.id, render.like)}><span className="icon">{render.like ? '❤️' : '🤍'}</span></div>
                        ) : (
                            <div className={`action ${render.like ? 'liked' : ''}`} onClick={()=>likeRender(render.id, render.like)}><span className="icon">{render.like ? '❤️' : '🤍'}</span> {render.likes} {render.likes == 1 ? 'like' : 'likes'}</div>
                        )}
                        { mode == 'grid' && (
                            <img className="thumbnail" onClick={() => goToGeneration(render.id)} src={render.thumbnail || render.image}></img>
                        )}
                        { mode == 'list' && (
                            <img className="image" src={render.image}></img>
                        )}
                    </picture>
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
    )
}
