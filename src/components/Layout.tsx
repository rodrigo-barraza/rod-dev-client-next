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