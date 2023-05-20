import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react'
import Layout from '../components/Layout';
import EventLibrary from '../libraries/EventLibrary';
import '../styles.scss'
import '../styles/animations.scss'
import Script from 'next/script'


function App({ Component, pageProps }: AppProps): JSX.Element {
    function postSession() {
        EventLibrary.postSession(1, screen.width, screen.height);
    }

    useEffect(() => {
        const sessionId = sessionStorage.id;
        if (sessionId) {
            EventLibrary.postEventSessionReturning(document.referrer, window.location.href);
        } else {
            EventLibrary.postEventSessionNew(document.referrer, window.location.href);
        }

        document.addEventListener('click', (event: MouseEvent) => {
            event = event || window.event;
            const target = event.target as any;
            // const text = target.textContent || target.innerText;
            if (target && target.nodeName === 'A') {
                if(target.href.includes('//development.rod.dev') ||
                target.href.includes('//rod.dev') ||
                target.href.includes('//localhost')) {
                    EventLibrary.postEventNavigationClick(target.href);
                } else {
                    EventLibrary.postEventLinkClick(target.href);
                }
            }
        }, false);

        setInterval(postSession, 1000);
    })

    return (
        <Layout>
            <Script
                id="google-tag-manager"
                src="https://www.googletagmanager.com/gtag/js?id=G-R61CVJFDVF"
                strategy="afterInteractive"
            />
            <Script 
                id="google-tag-manager2"
                strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-R61CVJFDVF');
                `}
            </Script>
            <Script 
                id="google-analytics"
                strategy="afterInteractive">
                {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-T62WJS5');
                `}
            </Script>
            <Component {...pageProps} />
            {/* <Analytics /> */}
        </Layout>
    )
}
export default App