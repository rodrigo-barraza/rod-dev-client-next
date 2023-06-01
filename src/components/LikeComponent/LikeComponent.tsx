import React from 'react'
import style from './LikeComponent.module.scss'
import { useState } from 'react'
import LikeApiLibrary from '@/libraries/LikeApiLibrary'
import GuestApiLibrary from '@/libraries/GuestApiLibrary'


export default function LikeComponent(props: any) {
    const {render, setFunction, setGuest}: {render: any, setFunction: any, setGuest: any} = props

    async function likeRender(id, like) {
        // setLike(!like)
        if (!like) {
            const postLike = await LikeApiLibrary.postLike(id)
            if (postLike.data) {
                setFunction(id)
            }
        } else {
            const postDelete = await LikeApiLibrary.deleteLike(id)
            if (postDelete.data) {
                setFunction(id)
            }
        }
        if (setGuest) {
            const getGuest = await GuestApiLibrary.getGuest()
            if (getGuest.data) {
              setGuest(getGuest.data)
            }
        }
    }

    return (
        // <div className={`${style.LikeComponent}`} disabled={disabled} onClick={onClick}>
        //     <button type={buttonType} disabled={disabled}>
        //     </button>
        // </div>
        <div className={`action ${render.like ? 'liked' : ''}`} onClick={()=>likeRender(render.id, render.like)}>
            <span className="icon">{render.like ? '❤️' : '🤍'}</span>
            { !!render.likes && (
                <span>{render.likes} {render.likes == 1 ? 'like' : 'likes'}</span>
            )}
        </div>
    )
}
