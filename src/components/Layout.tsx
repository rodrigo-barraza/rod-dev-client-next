import { useEffect } from 'react'
import FooterComponent from '@/components//FooterComponent/FooterComponent'
import HeaderComponent from '@/components/HeaderComponent/HeaderComponent'
import UtilityLibrary from '@/libraries/UtilityLibrary'
// import './globals.css'
import { Inter } from 'next/font/google'
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