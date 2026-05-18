"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import lodash from 'lodash'
import styles from './index.module.scss'
import ArtCollectionsCollection from '@/collections/ArtCollectionsCollection'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import type { ArtCollection } from '@/types/types'

export default function ClientHome() {
    const [shuffledArtCollection, setShuffledArtCollection] = useState<ArtCollection[]>([])

    useEffect(() => {
        async function getRender() {
            const collection = lodash.shuffle(ArtCollectionsCollection);
            setShuffledArtCollection(collection)
        }
        getRender()
    }, [])

    return (
    <main className={styles.home}>
        <div className="container" itemProp="creator" itemScope itemType="http://schema.org/Person">
            <h1>
                <span className="full-name"><span itemProp="givenName">Rodrigo</span> <span itemProp="familyName">Barraza</span></span>: <span itemProp="jobTitle">photographer</span>, <span itemProp="jobTitle">software engineer</span>, <span itemProp="jobTitle">artist</span>.
            </h1>
        </div>
        <div className="gallery">
            {shuffledArtCollection.map((artCollection, artCollectionIndex) => (
                <div className="image-container" key={artCollectionIndex}>
                    { artCollection.path && (
                        <Link 
                        className="image" 
                        href={`/collections/${artCollection.path}`}
                        onMouseOver={(event) => UtilityLibrary.playVideoOnMouseOver(event)}
                        onMouseLeave={(event) => UtilityLibrary.stopVideoOnMouseOver(event)}>
                            <div className="the-image">
                                { !artCollection.works[0].videoPath && artCollection.thumbnail && (
                                    <Image 
                                    src={UtilityLibrary.renderAssetPath(artCollection.thumbnail, artCollection.path)}
                                    alt={artCollection.description || artCollection.title}
                                    fill={true}/>
                                )}
                                { !artCollection.works[0].videoPath && !artCollection.thumbnail && (
                                    <Image 
                                    src={UtilityLibrary.renderAssetPath(artCollection.works[0].imagePath ?? '', artCollection.path)}
                                    alt={artCollection.description || artCollection.title}
                                    fill={true}/>
                                )}
                                { artCollection.works[0].videoPath && (
                                    <video muted loop itemProp="video"
                                    poster={artCollection.poster ? UtilityLibrary.renderAssetPath(artCollection.poster, artCollection.path) : ''}>
                                        <source src={UtilityLibrary.renderAssetPath(artCollection.works[0].videoPath, artCollection.path)} type="video/mp4"/>
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                <div className="inside-description">
                                    <div className="name" itemProp="name">{artCollection.title}</div>
                                    <div className="year" itemProp="dateCreated">{artCollection.year}</div>
                                </div>
                            </div>
                        </Link>

                    )}
                </div>
            ))}
        </div>
    </main>
    )
}
