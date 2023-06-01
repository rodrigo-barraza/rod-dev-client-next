import React from 'react'
import style from './ButtonComponent.module.scss'

export default function ButtonComponent(props: any) {
    const {label, type, className, disabled, onClick, icon}: {label: string, type: string, className: string, disabled: boolean, onClick: any, icon: string} = props

    let buttonType = type === 'button' ? 'button' : type === 'submit' ? 'submit' : 'button';

    let combinedClassNames;
    if (className) {
        combinedClassNames = className
                            .split(' ')
                            .map((name) => style[name])
                            .join(' ');
    }

    return (
        <div className={`${style.ButtonComponent} ${combinedClassNames} ${style[type]} ${style[icon]}`} disabled={disabled} onClick={onClick}>
            <button type={buttonType} disabled={disabled}>
                { icon && (
                    <span className={style.icon}>
                        {icon}
                    </span>
                )}
                <span className="label">{label}</span>
            </button>
        </div>
    )
}
