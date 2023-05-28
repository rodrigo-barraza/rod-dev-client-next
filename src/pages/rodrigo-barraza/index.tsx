import Image from 'next/image'
import SocialsCollection from '@/collections/SocialsCollection'
import AboutCollection from '@/collections/AboutCollection'
import styles from './index.module.scss'
import Head from 'next/head'
import { useRouter } from 'next/router'

export const getServerSideProps = async (context: any) => {
    const { req, query, res, resolvedUrl } = context

    let returnBody = {
        props: {
            meta: {},
        }
    }

    returnBody.props.meta = {
        title: 'The Software Engineer, Photographer, Artist: Rodrigo Barraza',
        description: 'About Rodrigo Barraza, a Vancouver software engineer, photographer and artist.',
        keywords: 'rodrigo, barraza, rodrigo barraza, vancouver, photographer, software engineer, artist, ai artist, animator, emily carr university',
        type: 'website',
        image: 'https://assets.rod.dev/collections/dreamwork/rodrigo-barraza-dreamwork-beach-medium-format-fuji-velvia-100.jpg',
    }

    return returnBody;
}
    

export default function AboutView(props) {
    const { meta } = props
    const router = useRouter()

    return (
        <main className={ styles.AboutView }>
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
                {meta.date && (
                    <meta property='article:published_time' content={meta.date}/>
                )}
                <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <div className="container">
                <div className="layout">
                    <div className="sidebar">
                        <Image
                            src="https://assets.rod.dev/images/rodrigo-barraza-black-and-white-portrait.jpg"
                            alt="A black and white photograph of Rodrigo Barraza"
                            width={ 250 }
                            height={ 250 }>
                        </Image>
                        <div className="socials">
                            <h1 className="title">Socials</h1>
                                {SocialsCollection.map((social, socialIndex) => (
                                    <a className={`social ${social.type}`} href={social.url} key={socialIndex} target="_blank">
                                        <div className="logo">{social.type}</div>
                                        <div className="social-name">{social.name}</div>
                                    </a>
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