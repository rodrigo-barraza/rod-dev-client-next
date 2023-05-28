import { useEffect } from 'react'
import FooterComponent from '@/components//FooterComponent/FooterComponent'
import HeaderComponent from '@/components/HeaderComponent/HeaderComponent'
import UtilityLibrary from '@/libraries/UtilityLibrary'
// import './globals.css'
import { Inter } from 'next/font/google'
import './Layout.module.scss'

function Layout({ children }: { children: React.ReactNode }) {
    function setAndAppendStyles() {
        const head = document.head;
        const style = document.createElement('style');
        const css = `
            .social.instagram .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/instagram.png', undefined)}");
                background-size: 100%;
            }
            .social.facebook .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/facebook.png', undefined)}");
                background-size: 100%;
            }
            .social.twitter .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/twitter.png', undefined)}");
                background-size: 100%;
            }
            .social.github .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/github.png', undefined)}");
                background-size: 100%;
                background-color: white;
                border-radius: 100%;
            }
            .social.deviantart .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/deviantart.png', undefined)}");
                background-size: 100%;
            }
            .social.behance .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/behance.png', undefined)}");
                background-size: 100%;
            }
            .social.flickr .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/flickr.png', undefined)}");
                background-size: 100%;
            }
            .social.foundationapp .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/foundationapp.png', undefined)}");
                background-size: 100%;
            }
            .social.opensea .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/opensea.png', undefined)}");
                background-size: 100%;
            }
            .social.superrare .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/superrare.png', undefined)}");
                background-size: 100%;
            }
            .social.discord .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/discord.png', undefined)}");
                background-size: 100%;
            }
            .social.keybase .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/keybase.png', undefined)}");
                background-size: 100%;
            }
            .social.linkedin .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('icons/linkedin.png', undefined)}");
                background-size: 100%;
            }
            .brand .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('images/rodrigo-barraza-logo.png', undefined)}");
            }
            .brand:hover .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('images/rodrigo-barraza-logo-animated.gif', undefined)}");
            }
            .name .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('images/rodrigo-barraza-logo.png', undefined)}");
            }
            .name:hover .logo {
                background-image: url("${UtilityLibrary.renderAssetPath('images/rodrigo-barraza-logo-animated.gif', undefined)}");
            }`
            head.appendChild(style);
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
    }

    // const meta = {
    //     title: 'Rodrigo Barraza: Photographer, Software Engineer, Artist',
    //     description: 'Visual portfolio of Rodrigo Barraza, a Vancouver-based photographer, software engineer and artist.',
    //     keywords: 'rodrigo barraza',
    //     type: 'website',
    //     ...pageMeta
    // }

    useEffect(() => {
        setAndAppendStyles()
    })
    return (
        <>
        {/* <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description}/>
            <meta name="keywords" content={meta.keywords}/>
            <meta property="og:url" content={`https://localhost:3000${router.asPath}`}/>
            <meta property="og:type" content={meta.type}/>
            <meta property="og:site_name" content="Rodrigo Barraza"/>
            <meta property="og:description" content={meta.description}/>
            <meta property="og:title" content={meta.title}/>
            {meta.date && (
                <meta property='article:published_time' content={meta.date}/>
            )}
            <link rel="icon" href="/images/favicon.ico" />
        </Head> */}
        <HeaderComponent/>
        {children}
        <FooterComponent/>
        </>
    )
}

export default Layout