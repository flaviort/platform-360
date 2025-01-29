'use client'

// libraries
import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePathname } from 'next/navigation'

// img / svg
import Logo from '@/assets/svg/logo/logo.svg'
import UxLongArrowRight from '@/assets/svg/ux/long-arrow-right.svg'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'

export default function Menu() {

    const currentPath = usePathname()

    // animation ref
    const menuAnimationRef = useRef<gsap.core.Timeline | null>(null)

    // open / close fs menu
    const [isShown, setIsShown] = useState(false)

	const openCloseFsMenu = () => {
		setIsShown(!isShown)
	}

    const closeFsMenu = () => {
		setIsShown(false)
	}

    useEffect(() => {
		setIsShown(isShown)

        if (menuAnimationRef.current) {
            if (isShown) {
                menuAnimationRef.current.play()
                document.body.style.overflowY = 'scroll'
                document.body.style.position = 'fixed'
            } else {
                menuAnimationRef.current.reverse()
                document.body.style.overflowY = 'auto'
                document.body.style.position = 'relative'
            }
        }
	}, [isShown])

    // menu animation
    useGSAP(() => {
        const menuAnimation = gsap.timeline({
            paused: true
        })

        menuAnimation.to('#fs-menu', {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            duration: 1
        })

        menuAnimation.to('#logo-menu svg path', {
            fill: '#F3F2EC',
            ease: 'power2.inOut',
            duration: .6
        }, '-=1')
    
        menuAnimation.fromTo('#fs-menu li', {
            y: 50,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            stagger: .05
        }, '-=.5')

        menuAnimation.fromTo('#fs-menu .button', {
            y: 50,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1
        }, '-=.4')

        menuAnimation.to('#fs-menu', {
            overflowY: 'auto',
            duration: 0
        })
        
        // store the animation timeline in the ref
        menuAnimationRef.current = menuAnimation
    })

    return (
        <>

            <section className={styles.topMenu}>
                <div className='container'>

                    <div className={clsx(styles.flex, 'white')}>

                        <Link
                            href={pages.home}
                            aria-label='Go to homepage'
                            className={styles.logo}
                            id='logo-menu'
                            onClick={closeFsMenu}
                        >
                            <Logo />
                        </Link>

                        <div className={styles.right}>

                            <ul className={styles.menu}>
                                {[
                                    {
                                        name: 'Home',
                                        href: '#'
                                    }
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            href={item.href}
                                            className={clsx(
                                                'medium hover-underline',
                                                {[styles.active]: currentPath === item.href}
                                            )}
                                            onClick={closeFsMenu}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={clsx(
                                    styles.openFs,
                                    isShown && styles.active,
                                    'medium'
                                )}
                                onClick={openCloseFsMenu}
                                type='button'
                            >

                                <span className='uppercase purple bold text-35'>
                                    <span>Menu</span>
                                    <span>Menu</span>
                                </span>

                                <span className='uppercase purple bold text-35'>
                                    Close
                                </span>

                            </button>

                        </div>

                    </div>

                </div>
            </section>

            <section className={styles.fsMenu} id='fs-menu'>
                <div className='container'>
                    <div className={styles.flex}>

                        <ul className={styles.menu}>
                            {[
                                {
                                    name: 'Home',
                                    href: pages.home
                                }
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link
                                        href={item.href}
                                        className={clsx(
                                            'text-95 bold uppercase',
                                            {[styles.active]: currentPath === item.href}
                                        )}
                                        onClick={closeFsMenu}
                                        data-text={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
            </section>

        </>
    )
}