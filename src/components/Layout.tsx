import FooterComponent from '@/components//FooterComponent/FooterComponent'
import HeaderComponent from '@/components/HeaderComponent/HeaderComponent'
import './Layout.module.scss'

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <HeaderComponent/>
        {children}
        <FooterComponent/>
        </>
    )
}

export default Layout