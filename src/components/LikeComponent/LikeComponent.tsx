import React from 'react'
import style from './LikeComponent.module.scss'
import { useState } from 'react'
import LikeApiLibrary from '@/libraries/LikeApiLibrary'
import FavoriteApiLibrary from '@/libraries/FavoriteApiLibrary'
import GuestApiLibrary from '@/libraries/GuestApiLibrary'


export default function LikeComponent(props: any) {
    const {render, setFunction, setGuest, type}: {render: any, setFunction: any, setGuest: any, type: string} = props

    async function likeRender(id: string, like: boolean) {
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

    async function postFavorite(id: string, favorite: boolean) {
        if (!favorite) {
            const postFavorite = await FavoriteApiLibrary.postFavorite(id)
            if (postFavorite.data) {
                setFunction(id)
            }
        } else {
            const deleteFavorite = await FavoriteApiLibrary.deleteFavorite(id)
            if (deleteFavorite.data) {
                setFunction(id)
            }
        }
    }

    return (
        <div className={`${style.LikeComponent}`}>
            { type === 'like' && (
                <button className={`${style.like} ${render.like ? style.active : ''}`} onClick={()=>likeRender(render.id, render.like)}>
                    <span className={style.icon}>Favorite</span>
                    <span className={style.amount}>{render.likes}</span>
                </button>
            )}
            { type === 'favorite' && (
                <button className={`${style.favorite} ${render.favorite ? style.active : ''}`} onClick={()=>postFavorite(render.id, render.favorite)}>
                    <span className={style.icon}>Bookmark</span>
                    <span className={style.amount}>{render.favorites}</span>
                </button>
            )}
        </div>
    )
}
