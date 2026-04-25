import lodash from 'lodash'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './[id].module.scss'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import ArtCollectionsCollection from '@/collections/ArtCollectionsCollection'
import SeoHead from '@/components/SeoHead/SeoHead'

export const getServerSideProps = async (context: any) => {
    const { query, resolvedUrl } = context
    
    const currentCollectionPath = query.id
    const currentCollection = ArtCollectionsCollection.find(collection => collection.path === currentCollectionPath)
    const currentCollectionWorks = currentCollection?.works as Array<any>

    let image = null;
    if (currentCollection.thumbnail) {
        image = UtilityLibrary.renderAssetPath(currentCollection.thumbnail, currentCollection.path)
    } else if (currentCollection.works[0].imagePath) {
        image = UtilityLibrary.renderAssetPath(currentCollection.works[0].imagePath, currentCollection.path)
    } else if (currentCollection.poster) {
        image = UtilityLibrary.renderAssetPath(currentCollection.poster, currentCollection.path)
    }

    return {
        props: {
            meta: UtilityLibrary.buildPageMeta(resolvedUrl, {
                title: `${currentCollection?.documentTitle}`,
                description: `${currentCollection?.documentDescription}`,
                keywords: `${currentCollection?.documentKeywords}`,
                image: image,
            }),
            currentCollectionWorks: currentCollectionWorks,
            currentCollection: currentCollection,
        }
    };
}

export default function Collection(props) {
    const { meta, currentCollectionWorks, currentCollection } = props
    const [moreCollections, setMoreCollections] = useState([])

    useEffect(() => {
        const result: any = lodash.reject(lodash.shuffle(ArtCollectionsCollection), { name: currentCollection?.title }).slice(0, 3)
        setMoreCollections(result)
    }, [currentCollection?.title])

    return (
        <main className={styles.CollectionView}>
            <SeoHead meta={meta} />
            <div className="collection">
                <div className="collection-details">
                    <div className="container">
                        <div>
                            <h1>{currentCollection?.title}</h1>
                            <span>{currentCollection?.year}</span>
                        </div>
                        <p>{currentCollection?.medium}</p>
                        <p className="duration">{UtilityLibrary.humanDuration(currentCollection?.duration)}</p>

                        { currentCollection?.ekphrasis && (
                            <p className="ekphrasis">{currentCollection.ekphrasis}</p>
                        )}
                        { currentCollection?.description && (
                            <p className="description" dangerouslySetInnerHTML={{ __html: currentCollection.description}}></p>
                        )}
                    </div>
                </div>

                {currentCollection && currentCollectionWorks && currentCollectionWorks.map((work, workIndex) => (
                    <div className={`work ${work?.orientation || currentCollection?.orientation} || ''`} key={workIndex}>
                        <div className="container">
                            { work.imagePath && (
                                <picture>
                                    <img
                                        onClick={(event) => UtilityLibrary.imageFullScreen(event, currentCollection.path, work.imagePath)}
                                        src={UtilityLibrary.renderAssetPath(work?.imagePath, currentCollection?.path)}
                                        alt={work.title}>
                                    </img>
                                </picture>
                            )}

                            { work.videoPath && (
                                <video id="oneVideo" autoPlay muted controls={currentCollection.videoControls} loop poster=""
                                key={work.title}
                                v-if="work.videoPath">
                                    <source src={UtilityLibrary.renderAssetPath(work.videoPath, currentCollection.path)} type="video/mp4"></source>
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            

                            { currentCollectionWorks.length >= 2 && (
                                <div className="card">
                                    <div>
                                        <h2>{work.title}</h2>
                                        <span className="year">{work.year}</span>
                                    </div>
                                    <p>{work.medium}</p>
                                    { work?.duration && (
                                        <p>{UtilityLibrary.humanDuration(work.duration)}</p>
                                    )}
                                    { work?.ekphrasis && (
                                        <p className="ekphrasis">{work.ekphrasis}</p>
                                    )}
                                    { work?.description && (
                                        <p className="info" dangerouslySetInnerHTML={{ __html: work?.description}}></p>
                                    )}
                                </div>
                            ) }
                        </div>
                    </div>
                ))}
            </div>

            <div className="container more-collections">
                <div className="section-title">More collections</div>
                <div className="collections">

                    {moreCollections.map((collection, collectionIndex) => (
                        <div className="collection" key={collectionIndex}>
                            <Link
                            href={`/collections/${collection.path}`}
                            onMouseOver={(event) => UtilityLibrary.playVideoOnMouseOver(event)}
                            onMouseLeave={(event) => UtilityLibrary.stopVideoOnMouseOver(event)}>
                                <div className="image">
                                    {!collection.works[0].videoPath && !collection.imagePath && (
                                        <Image
                                        src={UtilityLibrary.renderAssetPath(collection.works[0].imagePath, collection.path)}
                                        alt="123"
                                        fill={true}>
                                        </Image>
                                    )}
                                    { collection.works[0].videoPath && (
                                        <video muted loop
                                        preload="metadata"
                                        key={collection.title}
                                        poster={collection.poster ? UtilityLibrary.renderAssetPath(collection.poster, collection.path) : ''}>
                                            <source src={UtilityLibrary.renderAssetPath(collection.works[0].videoPath, collection.path)} type="video/mp4"></source>
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                    <div className="overlay">
                                        <div className="titl">{collection.title}</div>
                                        <div className="yea">{collection.year}</div>
                                    </div>
                                </div>
                                <div className="description">
                                    <div>
                                        <h1 className="title">{collection.title}</h1>
                                        <span className="year">{collection.year}</span>
                                    </div>
                                    <div>
                                        <span className="medium">{collection.medium}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </main>
  );
}