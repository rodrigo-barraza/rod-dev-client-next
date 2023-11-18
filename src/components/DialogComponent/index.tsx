import React from 'react'
import style from './style.module.scss'
import { useState, useEffect, useRef } from 'react'

export default function DialogComponent(props: any) {
    const {className, children, show}: {className: string, children: any, show: boolean} = props
    const [getLogo, setLogo] = useState('')
    const dialogReference: any = useRef({})
    let combinedClassNames;
    if (className) {
        combinedClassNames = className.split(' ').map((name) => style[name]).join(' ');
    }

    // useEffect(() => {
    //     if (show) {
    //         dialogReference.current.showModal()
    //     } else {
    //         dialogReference.current.close()
    //     }
    // }, [show])

    return (
        // <dialog id="DialogComponent" ref={dialogReference} className={`${style.DialogComponent} ${combinedClassNames}`}>
        //     {children}
        // </dialog>
        <>
            {show && (
                <div className={`${style.DialogComponent} ${combinedClassNames}`}>
                        <div className={style.modal}>
                            {children}
                        </div>
                </div>
            )}
        </>
    )
}