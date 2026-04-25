import React from 'react'
import style from './GalleryComponent.module.scss'
import { useState } from 'react';
import { useRouter } from 'next/router';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import BadgeComponent from '../BadgeComponent/BadgeComponent';
import RenderApiLibrary from '@/libraries/RenderApiLibrary';
import UtilityLibrary from '@/libraries/UtilityLibrary';
import LikeComponent from '../LikeComponent/LikeComponent';
import { useAlertContext } from '@/contexts/AlertContext';

export default function GalleryComponent(props) {
    const router = useRouter()
    const { renders, getRenders, getGuest, mode } = props;
    const [isDeleting, setIsDeleting] = useState({})
    const { setMessage } = useAlertContext();

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

    function downloadGeneration(generation) {
      UtilityLibrary.downloadImage(generation.image, generation.id);
    }
  
    function shareGeneration(generation) {
        setMessage('Copied Link!')
        UtilityLibrary.shareLink(generation.id);
        
        const timeoutTimer = setTimeout(function () {
            setMessage('')
            clearTimeout(timeoutTimer)
        }, 1000);
    }

    return (
        <div className={`${style.GalleryComponent} ${style[mode]}`}>
            { renders?.map((render, index) => (
                <div key={index} className="item">
                    <div className="container">
                    <picture className="RenderPictureComponent image">
                        { mode == 'grid' && (
                            <img className="thumbnail" onClick={() => UtilityLibrary.navigateToGeneration(router, render.id)} src={render.thumbnail || render.image}></img>
                        )}
                        { mode == 'list' && (
                            <img className="image" src={render.image}></img>
                        )}
                    </picture>
                    { mode == 'list' && (
                      <div className="RenderCardComponent">
                          { isDeleting[render.id] && (
                              <div className="overlay">
                                <div className="message">Are you sure you want to delete this?</div>	
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
                              {render.id}
                          </div>
                          <div className="date">{UtilityLibrary.toHumanDateAndTime(render.createdAt)}</div>
                          <div className="description">{render.prompt}</div>
                          <div className="badges">
                              <BadgeComponent type="sampler" value={render.sampler}/>
                              <BadgeComponent type="style" value={render.style}/>
                          </div>
                          <div className="actions">
                              <ButtonComponent 
                              className="mini"
                              label="Load"
                              type="button" 
                              onClick={() => UtilityLibrary.navigateToGeneration(router, render.id)}
                              ></ButtonComponent>
                              { render.isCreator && (
                                <ButtonComponent 
                                className="mini red"
                                label="Delete"
                                type="button"
                                disabled={isDeleting[render.id]}
                                onClick={() => startDeleteRender(render.id)}
                                ></ButtonComponent>
                              )}
                          </div>
                          <div className="super-actions">
                            <LikeComponent type="like" render={render} setFunction={getRenders}></LikeComponent>
                            <LikeComponent type="favorite" render={render} setFunction={getRenders}></LikeComponent>
                          </div>
                          <div className="super-actions2">
                            <ButtonComponent 
                            className="mini"
                            type="action" 
                            onClick={() => shareGeneration(render)}
                            icon="forward"
                            ></ButtonComponent>
                            <ButtonComponent 
                            className="mini"
                            type="action" 
                            onClick={() => downloadGeneration(render)}
                            icon="download"
                            ></ButtonComponent>
                          </div>
                      </div>
                    )}
                    </div>
                </div>
            ))}
        </div>
    )
}
