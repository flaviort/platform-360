'use client'

// libraries
import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePathname } from 'next/navigation'

// components
import Avatar from '@/components/Avatar'

// img / svg
import Logo from '@/assets/svg/logo/logo.svg'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'
import { firstChar, limitCharacters } from '@/utils/functions'

// db
import { user } from '@/db/db'

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
                <div className='container container--big'>

                    <div className={clsx(styles.flex, 'white')}>

                        <div className={styles.left}>

                            <Link
                                href={pages.dashboard_my_reports}
                                aria-label='Go to homepage'
                                className={styles.logo}
                            >
                                <Logo />
                            </Link>

                            <ul className={clsx(styles.menu, 'text-16')}>
                                {[
                                    {
                                        name: 'My Reports',
                                        href: '#'
                                    },
                                    {
                                        name: 'Solutions',
                                        href: '#'
                                    },
                                    {
                                        name: 'Resources',
                                        href: '#'
                                    }
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link href={item.href} className='white medium'>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                        </div>

                        <div className={styles.right}>

                            <div className={styles.icons}>

                            </div>

                            <div className={styles.tokens}>

                            </div>

                            <button className={styles.user}>

                                <Avatar
                                    image={user.image?.src}
                                    alt={(user.name?.first && user.name?.first) + (user.name?.last && ' ' + user.name?.last)}
                                    letter={user.name?.first}
                                />

                                <span className={styles.nameEmail}>

                                    <span className='text-16 white bold'>
                                        {user.name.first} {user.name.last && firstChar(user.name?.last) + '.'}
                                    </span>

                                    <span
                                        className='text-14 white'
                                        //{...(user.email.length > 20 ? { 'aria-label': user.email } : {})}
                                        //data-balloon-pos='down-right'
                                    >
                                        {limitCharacters(user.email, 20)}
                                    </span>

                                </span>

                            </button>

                        </div>

                    </div>

                </div>
            </section>

        </>
    )
}