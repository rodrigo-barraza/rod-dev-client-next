import { AppProps } from 'next/app'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react'
import Layout from '@/components/Layout';
import EventLibrary from '@/libraries/EventLibrary';
import '@/styles/styles.scss'
import '@/styles/animations.scss'
import { AlertProvider, useAlertContext } from '@/contexts/AlertContext'


function App({ Component, pageProps }: AppProps): JSX.Element {
    const { message } = useAlertContext();
    
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
            <AlertProvider>
                {message}
                <Component {...pageProps} />
            </AlertProvider>
            {/* <Analytics /> */}
        </Layout>
    )
}
export default App