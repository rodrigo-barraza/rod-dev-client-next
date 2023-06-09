import Link from 'next/link'
import styles from './FooterComponent.module.scss'
import ArtCollectionsCollection from '@/collections/ArtCollectionsCollection'
import SocialsCollection from '@/collections/SocialsCollection'


// const FooterComponent: React.FC<{ userId: string }> = () => {
const FooterComponent: React.FC = () => {
    function getLogo(logo) {
        return `https://assets.rod.dev/icons/${logo}.png`
    }

    return (
        <footer className={styles.FooterComponent}>
            <div className="spacer"></div>
            <div className="stripe"></div>
            <div className="container">
                <div className="footer-menu">
                    <div className="">
                        <div>
                            <div>
                                <div className="BrandComponent">
                                    <div className="logo"></div>
                                    <h3>RODRIGO BARRAZA</h3>
                                </div>
                                <p>Vancouver, Canada</p>
                            </div>
                            <p>© 2023 Rodrigo Barraza</p>
                        </div>
                    </div>
                    <div className="photography">
                        <div>
                        <h1>Photography</h1>
                        <ul>
                            { ArtCollectionsCollection.filter(artCollection => artCollection.type === 'photography').map((artCollection, artCollectionIndex) => (
                                <li key={artCollectionIndex}>
                                    <Link href={`/collections/${artCollection.path}`}>
                                        {artCollection.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        </div>
                    </div>
                    <div className="film">
                        <div>
                        <h1>Film</h1>
                        <ul>
                            { ArtCollectionsCollection.filter(artCollection => artCollection.type === 'film').map((artCollection, artCollectionIndex) => (
                                <li key={artCollectionIndex}>
                                    <Link href={`/collections/${artCollection.path}`}>
                                        {artCollection.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        </div>
                        <div className="ai">
                            <h1>AI Art</h1>
                            <ul>
                                { ArtCollectionsCollection.filter(artCollection => artCollection.type === 'ai').map((artCollection, artCollectionIndex) => (
                                    <li key={artCollectionIndex}>
                                        <Link href={`/collections/${artCollection.path}`}>
                                            {artCollection.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="animation">
                            <h1>AI Animation</h1>
                            <ul>
                                { ArtCollectionsCollection.filter(artCollection => artCollection.type === 'animation').map((artCollection, artCollectionIndex) => (
                                    <li key={artCollectionIndex}>
                                        <Link href={`/collections/${artCollection.path}`}>
                                            {artCollection.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="installation">
                            <h1>Installation</h1>
                            <ul>
                                { ArtCollectionsCollection.filter(artCollection => artCollection.type === 'installation').map((artCollection, artCollectionIndex) => (
                                    <li key={artCollectionIndex}>
                                        <Link href={`/collections/${artCollection.path}`}>
                                            {artCollection.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="socials">
                        <div>
                            <h1>Socials</h1>
                            <ul>
                                { SocialsCollection.map((social, socialIndex) => (
                                    <li className={`social ${social.type}`} key={socialIndex}>
                                        <Link target="_blank" href={social.url}>
                                            {/* <div className="logo"></div> */}
                                            <img className="logo" src={getLogo(social.type)} alt={social.type}></img>
                                            <span>{social.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterComponent