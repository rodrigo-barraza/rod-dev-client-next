import styles from './index.module.scss'
import Head from 'next/head'
import ProjectsCollection from '@/collections/ProjectsCollection'

export const getServerSideProps = async (context: any) => {
    const { req, query, res, resolvedUrl } = context

    let returnBody = {
        props: {
            meta: {},
        }
    }

    returnBody.props.meta = {
        url: `https://rod.dev${resolvedUrl}`,
        title: 'Rodrigo Barraza - Software Engineering Projects',
        description: 'Projects and Github repositories by software engineer: Rodrigo Barraza',
        keywords: 'rodrigo barraza, projects, repository, image captioning, blip2, github, google colab, disco diffusion, programming, software engineer, portfolio',
        type: 'website',
        image: 'https://assets.rod.dev/collections/dreamwork/rodrigo-barraza-dreamwork-beach-medium-format-fuji-velvia-100.jpg',
    }

    return returnBody;
}

export default function Projects(props) {
    const { meta } = props

    return (
        <main className={styles.AboutView}>
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description}/>
                <meta name="keywords" content={meta.keywords}/>
                <meta property="og:url" content={meta.url}/>
                <meta property="og:type" content={meta.type}/>
                <meta property="og:site_name" content="Rodrigo Barraza"/>
                <meta property="og:description" content={meta.description}/>
                <meta property="og:title" content={meta.title}/>
                <meta property="og:image" content={meta.image} />
                {meta.date && (
                    <meta property='article:published_time' content={meta.date}/>
                )}
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content={meta.title}/>
                <meta name="twitter:site" content="@rawdreygo"/>
                <meta name="twitter:url" content={meta.url}/>
                <meta name="twitter:image" content={meta.image}/>
                <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <div className="container">
            <div className="layout">
                <div className="main">

                    {ProjectsCollection.map((project, projectIndex) => (
                        <div key={projectIndex} className="about">
                            <div className="text">
                                <div className="about-info">
                                    <h1 className="title">{project.title} <span>{project.year}</span></h1>
                                    <p className="source">
                                        {project.link && (<a href={project.link} target="_blank">Preview</a>)}
                                        {project.github && (<a href={project.github} target="_blank">Github</a>)}
                                        {project.googleColab && (<a href={project.googleColab} target="_blank">Google Colab</a>)}
                                    </p>
                                    <p dangerouslySetInnerHTML={{ __html: project.description}}></p>
                                    <div className="languages">
                                        { project.languages.length && project.languages.map((language, languageIndex) => (
                                            <p key={languageIndex}>
                                                { language == 'Python' && (<span>🐍</span>) }
                                                { language == 'Jupyter Notebook' && (<span>🔴</span>) }
                                                { language == 'JavaScript' && (<span>🟨</span>) }
                                                { language == 'TypeScript' && (<span>🟦</span>) }
                                                { language == 'HTML' && (<span>🟧</span>) }
                                                { language == 'CSS' && (<span>🟩</span>) }
                                                { language == 'Solidity' && (<span>🟪</span>)}
                                                { language == 'React' && (<span>⚛️</span>)}
                                                { language == 'Next.js' && (<span>🔺</span>)}
                                                <span className="language">{language}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </main>
    )
}
