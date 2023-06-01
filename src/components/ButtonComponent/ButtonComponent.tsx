import React from 'react'
import style from './ButtonComponent.module.scss'

export default function ButtonComponent(props: any) {
    const {label, type, className, disabled, onClick, icon, href, logo}: {label: string, type: string, className: string, disabled: boolean, onClick: any, icon: string, href:string, logo:string} = props

    let buttonType = type === 'button' ? 'button' : type === 'submit' ? 'submit' : 'button';

    let combinedClassNames;
    if (className) {
        combinedClassNames = className.split(' ').map((name) => style[name]).join(' ');
    }

    return (
        <div className={`${style.ButtonComponent} ${combinedClassNames} ${type ? style[type] : ''} ${icon ? style[icon] : ''} ${logo ? style.logo : ''} ${logo ? style[logo] : ''}`} disabled={disabled} onClick={onClick}>
            { !href && (
                <button type={buttonType} disabled={disabled}>
                    { icon && ( <span className={style.icon}>{icon}</span> )}
                    <span className="label">{label}</span>
                </button>
            )}
            { href && (
                <a href={href} target="_blank">
                    { logo && ( <span className={`${style.logo} ${style[logo]}`}></span> )}
                    { icon && ( <span className={style.icon}>{icon}</span> )}
                    <span className={style.label}>{label}</span>
                </a>
            )}
        </div>
    )
}
