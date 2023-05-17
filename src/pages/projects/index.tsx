import styles from './index.module.scss'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Meta } from '../../types/types'

export default function Projects() {
    const router = useRouter()
    const meta: Meta = {
        title: 'Rodrigo Barraza - Software Engineering Projects',
        description: 'Projects and Github repositories by software engineer: Rodrigo Barraza',
        keywords: 'rodrigo barraza, projects, repository, image captioning, blip2, github, google colab, disco diffusion, programming, software engineer, portfolio',
        type: 'website',
    }
    return (
        <main className={styles.AboutView}>
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
            <div className="container">
            <div className="layout">
                <div className="main">
                <div className="about">
                    <div className="text">
                    <div className="about-info">
                        <h1 className="title">Inscriptor <span>2023</span></h1>
                        <p><a href="https://github.com/rodrigo-barraza/inscriptor" target="_blank">Github</a></p>
                        <p>Image captioning using in Python using <a href="https://github.com/salesforce/LAVIS" target="_blank">Salesforce&apos;s LAVIS BLIP2</a>: a generic and efficient pre-training strategy that easily harvests development of pretrained vision models and large language models (LLMs) for vision-language pretraining. Can be used to caption single images or as many as hundreds of thousands of images in a dataset in a single run.</p>
                        <p>🔵<span className="language">Python</span></p>
                    </div>
                    </div>
                </div>
                <div className="about">
                    <div className="text">
                    <div className="about-info">
                        <h1 className="title">Eye of Providence <span>2023</span></h1>
                        <p><a href="https://github.com/rodrigo-barraza/eye-of-providence" target="_blank">Github</a></p>
                        <p>Image and file sorting using <a href="https://github.com/spotify/annoy" target="_blank">Spotify&apos;s Annoy</a>: a C++ library with Python bindings to search for points in space that are close to a given query point. It also creates large read-only file-based data structures that are <a href="https://en.wikipedia.org/wiki/Mmap" target="_blank">mmapped</a> into memory so that many processes may share the same data. Sorts images by similarity based on a textual or image query.</p>
                        <p>🔵<span className="language">Python</span></p>
                    </div>
                    </div>
                </div>
                <div className="about">
                    <div className="text">
                    <div className="about-info">
                        <h1 className="title">Spatula <span>2023</span></h1>
                        <p><a href="https://github.com/rodrigo-barraza/spatula" target="_blank">Github</a></p>
                        <p>An image scraper using <a href="https://github.com/apify/crawlee" target="_blank">Apify&apos;s Crawlee</a>: a web scraping and browser automation library for Node.js that helps you build reliable and fast web-crawlers.</p>
                        <p>🟡<span className="language">JavaScript</span></p>
                    </div>
                    </div>
                </div>
                <div className="about">
                    <div className="text">
                    <div className="about-info">
                        <h1 className="title">Pristine Diffusion <span>2022</span></h1>
                        <p><a href="https://github.com/rodrigo-barraza/pristine-disco-diffusion" target="_blank">Github</a>, <a href="https://colab.research.google.com/github/rodrigo-barraza/pristine-disco-diffusion/blob/master/rodrigos-pristine-disco-diffusion.ipynb" target="_blank">Google Colab</a></p>
                        <p>A modification of a clip-guided diffusion model that can generate amazing images from text prompts. Great at generating abstract art that is vivid in color and sharp in details, written in Python. Inspired by <a href="https://github.com/crowsonkb" target="_blank">Katherine Crowson&apos;s</a> fined tuned diffusion model that was optimized by many other developers and utilizes <a href="https://github.com/openai/CLIP" target="_blank">OpenAI&apos;s CLIP</a> and the open-source alternative <a href="https://github.com/mlfoundations/open_clip" target="_blank">OpenClip</a>.</p>
                        <p>🔴<span className="language">Jupyter Notebook</span></p>
                    </div>
                    </div>
                </div>
                <div className="about">
                    <div className="text">
                    <div className="about-info">
                        <h1 className="title">Wakanda <span>2020</span></h1>
                        <p><a href="https://github.com/rodrigo-barraza/wakanda" target="_blank">Github</a></p>
                        <p>This <a href="https://flexepin.com/" target="_blank">Directpay Flexepin</a> project is designed to streamline the acquisition and exchange of diverse cryptocurrencies, digital currencies, and digital assets by leveraging text messaging technology. This innovative approach enables individuals to conveniently employ their mobile phone minutes as a viable currency for conducting transactions. By integrating <a href="https://www.twilio.com/" target="_blank">Twilio&apos;s Communication APIs</a>, Directpay provides customers with access to the Flexepin service, facilitating swift, user-friendly, and secure online payment solutions.</p>
                        <p>🟡<span className="language">JavaScript</span></p>
                    </div>
                    </div>
                </div>
                <div className="about">
                    <div className="text">
                    <div className="about-info">
                        <h1 className="title">EXE Cash <span>2019</span></h1>
                        <p><a href="https://github.com/rodrigo-barraza/exe-cash" target="_blank">Github</a></p>
                        <p>EXE Cash, a state-of-the-art ERC20 Smart Contract designed to facilitate the efficient tracking and management of fungible tokens. This groundbreaking solution opens up a world of possibilities for various applications, such as serving as a medium of exchange for digital currencies, providing voting rights, enabling staking, and much more. Einstein Cash leverages the Ethereum blockchain&apos;s capabilities to implement a secure and transparent platform for the issuance and management of digital assets. By adhering to the ERC20 token standard, EXE Cash ensures seamless interoperability with other Ethereum-based decentralized applications (dApps) and services.</p>
                        <p>⚫<span className="language">Solidity</span></p>
                    </div>
                    </div>
                </div>
                <div className="about">
                    <div className="text">
                    <div className="about-info">
                        <h1 className="title">AI Fraud Detection Model <span>2018</span></h1>
                        <p><a href="https://github.com/rodrigo-barraza/ai-fraud-detection-model" target="_blank">Github</a></p>
                        <p>A robust and self-contained fraud detection model that harnesses the power of the Intrusion Detection System (IDS) package, specifically tailored for software developers. This sophisticated model can be effortlessly deployed within a containerized environment, seamlessly integrating with your existing MongoDB infrastructure. The primary objective of this project was to develop a minimum viable product (MVP) that demonstrates its core functionality and potential for future enhancements. The fraud detection model has been meticulously engineered to analyze vast amounts of data, identifying patterns and anomalies indicative of fraudulent activities. By leveraging advanced machine learning algorithms, the model continuously adapts and refines its detection capabilities, ensuring an ever-evolving defense against emerging threats. The integration with MongoDB allows for efficient storage, retrieval, and management of the data necessary for the model&apos;s operations, further streamlining the process and enhancing performance. Moreover, the containerized deployment ensures scalability, portability, and ease of maintenance, making it an ideal solution for developers seeking to incorporate cutting-edge fraud detection capabilities into their projects.</p>
                        <p>🔴<span className="language">Jupyter Notebook</span></p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </main>
    )
}
