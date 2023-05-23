import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ActiveLink from '../ActiveLink'
import styles from './HeaderComponent.module.scss'
import SocialsCollection from '../../collections/SocialsCollection'
import PagesCollection from '../../collections/PagesCollection'
import UtilityLibrary from '../../libraries/UtilityLibrary'

const HeaderComponent: React.FC = () => {
    const [pageOffset, setPageOffset] = useState(0)
    const [mobileMenu, setMobileMenu] = useState(false)
    const [stripeClass, setStripeClass] = useState({})
    const [routeName, setRouteName] = useState('')
    const router = useRouter()
    const queryId = router.query.id
    let path = ''

    if (queryId !== undefined && typeof queryId === "string") {
        path = router.asPath.replaceAll('/', '').replace(queryId, '')
    } else {
        path = router.asPath.replaceAll('/', '')
    }

    useEffect(() => {
        function onScroll() {
            setPageOffset(window.pageYOffset)
        }
        window.addEventListener('scroll', onScroll);
    })
    useEffect(() => {
        const setStripeStyles = function() {
            console.log('fire')
            const style: Object = {};
            const stripe: HTMLElement | null = document.querySelector(".stripe");
            const floaty: HTMLElement | null = document.querySelector("header");
            const collectionDetails: HTMLElement | null = document.querySelector(".collection-details") || document.querySelector(".details");
            if ((path === 'collections' && !collectionDetails)) {
            } else if (stripe && collectionDetails && floaty && (path === 'collections' || path === 'renders')) {
                const collectionDetailsHeight = collectionDetails.offsetHeight;
                const floatyHeight = floaty.offsetHeight;
                stripe.setAttribute("style",`height:${collectionDetailsHeight + floatyHeight + 80}px`);
            } else if (stripe && path === 'about') {
                stripe.setAttribute("style",'height:300px');
            } else if (stripe && path === 'projects') {
                stripe.setAttribute("style",'height:200px');
            } else if (stripe) {
                stripe.removeAttribute("style");
            }
            setStripeClass(path);
            return [path, style]
        }

        setRouteName(path)
        const timeoutTimer = setTimeout(function () {
            setStripeStyles();
            clearTimeout(timeoutTimer);
        }, 100);
    }, [path])

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
                            { PagesCollection.map((page, pageIndex) => (
                                <li className="ai-art" key={pageIndex}>
                                    <ActiveLink activeClassName="active" href={page.path}>
                                        {page.emoji && <span className="emoji">{page.emoji}</span>}
                                        {UtilityLibrary.capitalize(page.name)}
                                    </ActiveLink>
                                </li>
                            ))}
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
                            { PagesCollection.map((page, pageIndex) => (
                                <li className="ai-art" key={pageIndex}><ActiveLink activeClassName="active" href={page.path} onClick={() => setMobileMenu(false)} >{UtilityLibrary.capitalize(page.name)}</ActiveLink></li>
                            ))}
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