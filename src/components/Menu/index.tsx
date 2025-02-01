'use client'

// libraries
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

// components
import Avatar from '@/components/Avatar'

// img / svg
import Logo from '@/assets/svg/logo/logo.svg'
import { CircleHelp, Mail, Bell, Zap, Folders, ShoppingCart, ChartNoAxesCombined, Search, FilePenLine, Menu } from 'lucide-react'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'
import { firstChar, limitCharacters } from '@/utils/functions'

// db (temporary)
import { user } from '@/db/db'

export default function TopMenu() {

    // open / close fs menu
    const [isShown, setIsShown] = useState(false)

	const openCloseFsMenu = () => {
		setIsShown(!isShown)
	}

    const closeFsMenu = () => {
		setIsShown(false)
	}

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
                                        href: pages.dashboard_my_reports
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
                                        <Link href={item.href} className='white semi-bold'>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                        </div>

                        <div className={styles.right}>

                            <div className={styles.icons}>

                                <button
                                    className={clsx(styles.icon, styles.menu)}
                                    aria-label='Help'
                                >
                                    <Menu />
                                </button>

                                <button
                                    className={styles.icon}
                                    aria-label='Help'
                                    data-balloon-pos='down-center'
                                >
                                    <CircleHelp />
                                </button>

                                <button
                                    className={styles.icon}
                                    aria-label='Messages'
                                    data-balloon-pos='down-center'
                                >
                                    <Mail />
                                </button>

                                <button
                                    className={styles.icon}
                                    aria-label='Notifications'
                                    data-balloon-pos='down-center'
                                >
                                    <Bell />
                                </button>

                            </div>

                            <div className={styles.tokens}>

                                <button
                                    className={clsx(styles.button, 'text-16 semi-bold')}
                                >
                                    <Zap className={styles.icon} />
                                    <span className={styles.number}>104</span>
                                    <span className={styles.text}>Tokens</span>
                                </button>

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
                                        //{...(user.email.length > 15 ? { 'aria-label': user.email } : {})}
                                        //data-balloon-pos='down-right'
                                    >
                                        {limitCharacters(user.email, 15)}
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