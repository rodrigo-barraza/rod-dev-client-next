import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import lodash from 'lodash'
import styles from './index.module.scss'
import ArtCollectionsCollection from '../collections/ArtCollectionsCollection'
import UtilityLibrary from '../libraries/UtilityLibrary'
import { useRouter } from 'next/router'

export default function Index() {
    const router = useRouter()
    const [shuffledArtCollection, setShuffledArtCollection] = useState([])

    useEffect(() => {
        setShuffledArtCollection(lodash.shuffle(ArtCollectionsCollection))
    }, [])

    const meta = {
        title: 'Rodrigo Barraza: Photographer, Software Engineer, Artist',
        description: 'Visual portfolio of Rodrigo Barraza, a Vancouver-based photographer, software engineer and artist.',
        keywords: 'rodrigo barraza',
        type: 'website',
    }
    return (
    <main className={styles.home}>
        <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description}/>
            <meta name="keywords" content={meta.keywords}/>
                <meta property="og:url" content={`https://rod.dev${router.asPath}`}/>
            <meta property="og:type" content={meta.type}/>
            <meta property="og:site_name" content="Rodrigo Barraza"/>
            <meta property="og:description" content={meta.description}/>
            <meta property="og:title" content={meta.title}/>
            {meta.date && (
                <meta property='article:published_time' content={meta.date}/>
            )}
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <div className="container" itemProp="creator" itemScope itemType="http://schema.org/Person">
            <h1>
                <span className="full-name"><span itemProp="givenName">Rodrigo</span> <span itemProp="familyName">Barraza</span></span>: <span itemProp="jobTitle">photographer</span>, <span itemProp="jobTitle">software engineer</span>, <span itemProp="jobTitle">artist</span>.
            </h1>
        </div>
        <div className="gallery">
            {shuffledArtCollection.map((artCollection, artCollectionIndex) => (
                <div className="image-container" key={artCollectionIndex}>
                    <Link 
                    className="image" 
                    href={`/collections/${artCollection.path}`}
                    onMouseOver={(event) => UtilityLibrary.playVideoOnMouseOver(event)}
                    onMouseLeave={(event) => UtilityLibrary.stopVideoOnMouseOver(event)}>
                        <div className="the-image">
                            { !artCollection.works[0].videoPath && artCollection.thumbnail && (
                                <Image 
                                src={UtilityLibrary.renderAssetPath(artCollection.thumbnail, artCollection.path)}
                                alt={artCollection.description}
                                fill={true}/>
                            )}
                            { !artCollection.works[0].videoPath && !artCollection.thumbnail && (
                                <Image 
                                src={UtilityLibrary.renderAssetPath(artCollection.works[0].imagePath, artCollection.path)}
                                alt={artCollection.description}
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
                </div>
            ))}
        </div>
    </main>
    )
}