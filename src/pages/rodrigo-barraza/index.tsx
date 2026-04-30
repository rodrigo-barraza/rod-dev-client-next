import Image from 'next/image'
import SocialsCollection from '@/collections/SocialsCollection'
import AboutCollection from '@/collections/AboutCollection'
import styles from './index.module.scss'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'
import SeoHead from '@/components/SeoHead/SeoHead'
import UtilityLibrary from '@/libraries/UtilityLibrary'

export const getServerSideProps = async (context: any) =>
    UtilityLibrary.buildServerSideMetaProps(context, {
        title: 'The Software Engineer, Photographer, Artist: Rodrigo Barraza',
        description: 'About Rodrigo Barraza, a Vancouver software engineer, photographer and artist.',
        keywords: 'rodrigo, barraza, rodrigo barraza, vancouver, photographer, software engineer, artist, ai artist, animator, emily carr university',
        image: 'https://assets.rod.dev/rod-dev-assets/collections/dreamwork/rodrigo-barraza-dreamwork-beach-medium-format-fuji-velvia-100.jpg',
    });

    

export default function AboutView(props) {
    const { meta } = props

    return (
        <main className={ styles.AboutView }>
            <SeoHead meta={meta} />
            <div className="container">
                <div className="layout">
                    <div className="sidebar">
                        <Image
                            src="https://assets.rod.dev/rod-dev-assets/images/rodrigo-barraza-black-and-white-portrait.jpg"
                            alt="A black and white photograph of Rodrigo Barraza"
                            width={ 250 }
                            height={ 250 }>
                        </Image>
                        <div className="socials">
                                {SocialsCollection.map((social, socialIndex) => (
                                    <ButtonComponent 
                                        key={socialIndex}
                                        href={social.url}
                                        label={social.name}
                                        className="mini"
                                        logo={social.type}
                                ></ButtonComponent>
                                ))}
                        </div>
                    </div>
                    <div className="main">
                        <div className="about">
                            <div className="text">
                                <div className="about-info">
                                    <p><span className="full-name">Rodrigo Barraza</span> is a software engineer, artist and photographer based out of Vancouver, British Columbia, Canada. He emerged as an internet artist who works in a variety of media and focuses on photography, AI art, film, animation, visual design and illustration.</p>

                                    <p>Rodrigo grew up with an interest in visual media and started out as a young animator and illustrator in 2001. He soon started experimenting with film photography, videography, game development and graphic design. In recent years, he has focused on the analog and digital photographic arts. Combining his passion for software development, and with the rise of artificial intelligence media since 2017, he has pivoted his practice to algorithmic and generative art, and generative artificial media through the use of CLIP-driven image synthesis. Rodrigo holds a BFA in Photography from the Emily Carr University of Art + Design in Vancouver, Canada.</p>

                                    <p>When it comes to software development, Rodrigo began programming in 2004, specializing on front-end web development and Flash web applications. After graduating from University, and working with many startups and corporations over the years, he eventually came to lead large teams in various companies, and in 2017 started his own tech start-up, Einstein Exchange, with two other co-founders. The company focused on providing worldwide clients with a safe, secure and simple way to buy, trade and invest in virtual currencies. Since 2019, Rodrigo has been a software consultant and contractor for various startups.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="extra-info">
                                {AboutCollection.map((about, aboutIndex) => (
                                    <div className="collection" key={aboutIndex}>
                                        <h1 className="title">{about.name}</h1>
                                        { about.collections.map((object, objectIndex) => (
                                            <div className="object" key={objectIndex}>
                                                {object.url ? (
                                                    <p>
                                                        <a className="object-title" href={object.url} target="_blank" rel="noreferrer">
                                                            {object.name}
                                                        </a>
                                                        <span>{object.year}</span>
                                                    </p>
                                                ) : (
                                                    <p>
                                                        <span className="object-title">{object.name}</span>
                                                        <span>{object.year}</span>
                                                    </p>
                                                )}
                                                <p>
                                                    {object.venue && <span>{object.venue}</span>}
                                                    {object.location && <span>{object.location}</span>}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}