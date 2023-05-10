import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ActiveLink from '../ActiveLink'
import styles from './HeaderComponent.module.scss'
import SocialsCollection from '../../collections/SocialsCollection'

const HeaderComponent = () => {
    const [pageOffset, setPageOffset] = useState(0)
    const [mobileMenu, setMobileMenu] = useState(false)
    const [stripeClass, setStripeClass] = useState({})
    const [routeName, setRouteName] = useState('')
    const router = useRouter()
    const queryId = router.query.id
    let path: string;
    if (typeof queryId === 'string') {
        path = router.asPath.replace(queryId, '').replaceAll('/', '')
    }


    const setStripeStyles = function() {
        const style = {};
        const stripe = document.querySelector(".stripe");
        const floaty = document.querySelector("header");
        const CollectionDetails = document.querySelector<HTMLElement>(".collection-deets");

        if (path === 'collections' && !CollectionDetails) {
        } else if (path === 'collections') {
            const detailsHeight = CollectionDetails?.offsetHeight;
            const floatyHeight = floaty?.offsetHeight;
            stripe!.setAttribute("style",`height:${detailsHeight! + floatyHeight! + 80}px`);
            if (queryId === 'dreamwork') {
            }
        } else if (path === 'about') {
            stripe!.setAttribute("style",'height:300px');
        } else if (path === 'projects') {
            stripe!.setAttribute("style",'height:200px');
        } else {
            stripe!.removeAttribute("style");
        }
        setStripeClass(path);
        return [path, style]
    }

    useEffect(() => {
        setRouteName(path)
        const timeoutTimer = setTimeout(function () {
            setStripeStyles();
            clearTimeout(timeoutTimer);
        }, 100);
        function scrolling2() {
            setPageOffset(window.pageYOffset)
        }
        window.addEventListener('scroll', scrolling2);
    })
    return (
        <header className={`${styles.HeaderComponent} ${routeName}`}>
            <div className={`stripe ${stripeClass}`}></div>
            <div className="fixed"></div>
            <div className={`floaty ${pageOffset > 35 ? "tiny" : ""}`}>
                <div className="container">
                    <div className="name">
                        <Link href="/">
                            <div className="logo"></div>
                            <div className="text">RODRIGO BARRAZA</div>
                        </Link>
                    </div>
                    <nav className="full">
                        <ul>
                            <li className="ai-art"><ActiveLink activeClassName="active" href="/">Collections</ActiveLink></li>
                            <li className="ai-art"><ActiveLink activeClassName="active" href="/projects">Projects</ActiveLink></li>
                            <li className="ai-art"><ActiveLink activeClassName="active" href="/rodrigo-barraza">About</ActiveLink></li>
                        </ul>
                    </nav>
                    <div className="hamburger">
                        <div>
                            { !mobileMenu && (
                                <span onClick={() => setMobileMenu(true)}>☰</span>
                            )}
                            { mobileMenu && (
                                <span onClick={() => setMobileMenu(false)}>✖</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            { mobileMenu && (
                <div className="overlay">
                    <nav className="shrink">
                        <ul>
                            <li className="ai-art"><ActiveLink onClick={() => setMobileMenu(false)} activeClassName="active" href="/">Collections</ActiveLink></li>
                            <li className="ai-art"><ActiveLink onClick={() => setMobileMenu(false)} activeClassName="active" href="/projects">Projects</ActiveLink></li>
                            <li className="ai-art"><ActiveLink onClick={() => setMobileMenu(false)} activeClassName="active" href="/rodrigo-barraza">About</ActiveLink></li>
                        </ul>
                    </nav>
                    <ul className="socials">
                        { SocialsCollection.map((social, socialIndex) => (
                            <li key={socialIndex} className={`social ${social.type}`}>
                                <a target="_blank" href={social.url}><div className="logo"></div></a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    )
}

export default HeaderComponent