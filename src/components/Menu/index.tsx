'use client'

// libraries
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

// components
import Avatar from '@/components/Avatar'
import { SubWrapper, Sub } from '@/components/SubMenu'

// img / svg
import Logo from '@/assets/svg/logo/logo.svg'
import { CircleHelp, Mail, Bell, Zap, X, Menu, Wallet, Landmark, LogOut, CircleUser } from 'lucide-react'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'
import { limitCharacters } from '@/utils/functions'

// context
import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@/contexts/UserContext'

export default function TopMenu() {

    // open / close fs menu
    const [isShown, setIsShown] = useState(false)

	const openCloseFsMenu = () => {
		setIsShown(!isShown)
	}

    const closeFsMenu = () => {
		setIsShown(false)
	}

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && isShown) {
                closeFsMenu()
            }
        }
        
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isShown])

    useEffect(() => {
        if (isShown) {
            document.body.classList.add('no-scroll')
        } else {
            document.body.classList.remove('no-scroll')
        }
    }, [isShown])

    const { userData } = useUser()
    const { logout, isAuthenticated } = useAuth()

    return (
        <>

            <section className={styles.topMenu} data-top-menu>
                <div className={clsx('container', isAuthenticated && 'container--big')}>

                    <div className={clsx(styles.flex, 'white')}>

                        <div className={styles.left}>

                            <Link
                                href={pages.home}
                                aria-label='Go to homepage'
                                className={styles.logo}
                            >
                                <Logo />
                            </Link>

                            {isAuthenticated && (
                                <ul className={clsx(styles.menu, 'text-16')}>
                                    {[
                                        {
                                            name: 'My Reports',
                                            href: pages.dashboard.my_reports
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
                            )}

                        </div>

                        {isAuthenticated && (
                            <div className={styles.right}>

                                <div className={styles.icons}>

                                    <button
                                        className={clsx(styles.icon, styles.menu)}
                                        aria-label='Help'
                                        onClick={openCloseFsMenu}
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

                                    <SubWrapper className={styles.subWrapper}>

                                        <button
                                            className={styles.icon}
                                            aria-label='Notifications'
                                            data-balloon-pos='down-center'
                                            data-toggle-sub
                                        >
                                            <Bell />
                                        </button>

                                        <Sub className={styles.sub}>
                                            <div className={clsx(styles.scroll, 'gray-600')}>

                                                <p className='text-18 semi-bold blue'>
                                                    Notifications
                                                </p>

                                                {[
                                                    {
                                                        time: '1 hour ago',
                                                        text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur praesentium modi provident fuga consectetur nisi odio obcaecati adipisci eaque!',
                                                        link: '#'
                                                    },
                                                    {
                                                        time: '1 day ago',
                                                        text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur praesentium modi provident fuga consectetur nisi odio obcaecati adipisci eaque!',
                                                        link: '#'
                                                    },
                                                    {
                                                        time: '3 days ago',
                                                        text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur praesentium modi provident fuga consectetur nisi odio obcaecati adipisci eaque!',
                                                        link: '#'
                                                    },
                                                    {
                                                        time: '1 week ago',
                                                        text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur praesentium modi provident fuga consectetur nisi odio obcaecati adipisci eaque!',
                                                        link: '#'
                                                    },
                                                    {
                                                        time: '1 month ago',
                                                        text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur praesentium modi provident fuga consectetur nisi odio obcaecati adipisci eaque!',
                                                        link: '#'
                                                    },
                                                    {
                                                        time: '2 months ago',
                                                        text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur praesentium modi provident fuga consectetur nisi odio obcaecati adipisci eaque!',
                                                        link: '#'
                                                    },
                                                    {
                                                        time: '1 year ago',
                                                        text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur praesentium modi provident fuga consectetur nisi odio obcaecati adipisci eaque!',
                                                        link: '#'
                                                    },
                                                    {
                                                        time: '2 years ago',
                                                        text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur praesentium modi provident fuga consectetur nisi odio obcaecati adipisci eaque!',
                                                        link: '#'
                                                    }
                                                ].map((item, i) => (
                                                    <button key={i}>

                                                        <span className={clsx(styles.date, 'text-12')}>
                                                            {item.time}
                                                        </span>

                                                        <span className={clsx(styles.text, 'text-14')}>
                                                            {limitCharacters(item.text, 100)}
                                                        </span>

                                                    </button>
                                                ))}
                                            </div>
                                        </Sub>

                                    </SubWrapper>

                                </div>

                                <SubWrapper className={styles.tokens}>

                                    <button
                                        className={clsx(styles.button, 'text-16 semi-bold')}
                                        data-toggle-sub
                                    >
                                        <Zap className={styles.icon} />
                                        <span className={styles.number}>104</span>
                                        <span className={styles.text}>Tokens</span>
                                    </button>

                                    <Sub className={styles.sub}>
                                        {[
                                            {
                                                icon: Landmark,
                                                text: 'Edit Payment Method',
                                                link: '#'
                                            },
                                            {
                                                icon: Wallet,
                                                text: 'Add more tokens',
                                                link: '#'
                                            }
                                        ].map((item, i) => (
                                            <button
                                                className='text-14 bold gray-800'
                                                key={i}
                                            >

                                                <item.icon />

                                                <span>
                                                    {item.text}
                                                </span>

                                            </button>
                                        ))}
                                    </Sub>

                                </SubWrapper>

                                <SubWrapper className={styles.user}>

                                    <button
                                        className={styles.button}
                                        data-toggle-sub
                                    >

                                        <Avatar
                                            image={userData?.image}
                                            alt={userData?.name ? `${userData.name.first || ''} ${userData.name.last || ''}`.trim() : userData?.email || ''}
                                            letter={userData?.name?.first?.[0] || userData?.email?.[0]?.toUpperCase()}
                                        />

                                        <span className={styles.nameEmail}>

                                            <span className='text-16 white bold'>
                                                {userData?.name?.first || userData?.email?.split('@')[0]} {userData?.name?.last && `${userData.name.last[0]}.`}
                                            </span>

                                            <span className='text-14 white'>
                                                {limitCharacters(userData?.email || '', 15)}
                                            </span>

                                        </span>

                                    </button>

                                    <Sub className={styles.sub}>

                                        <div className={styles.avatar}>

                                            <Avatar
                                                image={userData?.image}
                                                alt={userData?.name ? `${userData.name.first || ''} ${userData.name.last || ''}`.trim() : userData?.email || ''}
                                                letter={userData?.name?.first?.[0] || userData?.email?.[0]?.toUpperCase()}
                                            />

                                            <span className={styles.nameEmailMobile}>

                                                <span className='text-16 bold'>
                                                    {userData?.name?.first || userData?.email?.split('@')[0]} {userData?.name?.last && `${userData.name.last[0]}.`}
                                                </span>

                                                <span className={clsx(styles.email, 'text-14')}>
                                                    {limitCharacters(userData?.email || '', 40)}
                                                </span>

                                            </span>

                                        </div>

                                        <div className={styles.items}>
                                            {[
                                                {
                                                    icon: CircleUser,
                                                    text: 'Account Settings',
                                                    link: pages.account.settings
                                                },
                                                {
                                                    icon: Landmark,
                                                    text: 'Edit Payment Method',
                                                    link: '#'
                                                },
                                                {
                                                    icon: Mail,
                                                    text: 'Messages',
                                                    link: '#'
                                                },
                                                {
                                                    icon: Bell,
                                                    text: 'Notifications',
                                                    link: '#'
                                                },
                                                {
                                                    icon: CircleHelp,
                                                    text: 'Help',
                                                    link: '#'
                                                }
                                            ].map((item, i) => (
                                                <Link
                                                    className='text-14 bold gray-800'
                                                    key={i}
                                                    href={item.link}
                                                >

                                                    <item.icon />

                                                    <span>
                                                        {item.text}
                                                    </span>

                                                </Link>
                                            ))}

                                            <div className={styles.line}></div>

                                            <button
                                                className='text-14 bold gray-800'
                                                onClick={logout}
                                                type='button'
                                            >

                                                <LogOut />

                                                <span>
                                                    Logout
                                                </span>

                                            </button>

                                        </div>

                                    </Sub>

                                </SubWrapper>

                            </div>
                        )}

                    </div>

                </div>
            </section>

            {isAuthenticated && (
                <section className={clsx(styles.fsMenu, isShown && styles.open)} data-fs-menu>

                    <div
                        className={styles.bg}
                        onClick={closeFsMenu}
                    ></div>

                    <div className={styles.wrapper}>

                        <div className={styles.top}>

                            <p className='semi-bold uppercase blue'>
                                Menu
                            </p>

                            <button
                                className={styles.close}
                                onClick={closeFsMenu}
                            >
                                <X />
                            </button>

                        </div>

                        <div className={styles.items}>

                            <div className={styles.avatar}>

                                <Avatar
                                    image={userData?.image}
                                    alt={userData?.name ? `${userData.name.first || ''} ${userData.name.last || ''}`.trim() : userData?.email || ''}
                                    letter={userData?.name?.first?.[0] || userData?.email?.[0]?.toUpperCase()}
                                />

                                <span className={styles.nameEmailMobile}>

                                    <span className='text-16 bold'>
                                        {userData?.name?.first || userData?.email?.split('@')[0]} {userData?.name?.last && `${userData.name.last[0]}.`}
                                    </span>

                                    <span className={clsx(styles.email, 'text-14')}>
                                        {limitCharacters(userData?.email || '', 40)}
                                    </span>

                                </span>

                            </div>

                            <ul className={clsx(styles.menu, 'text-16')}>
                                {[
                                    {
                                        name: 'My Reports',
                                        href: pages.dashboard.my_reports
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
                                        <Link
                                            href={item.href}
                                            className='gray-600 semi-bold'
                                            onClick={closeFsMenu}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <ul className={clsx(styles.menu2, 'text-16')}>
                                {[
                                    {
                                        icon: CircleUser,
                                        name: 'Account Settings',
                                        href: pages.account.settings,
                                        mobile: true
                                    },
                                    {
                                        icon: Landmark,
                                        name: 'Edit Payment Method',
                                        href: '#',
                                        mobile: true
                                    },
                                    {
                                        icon: CircleHelp,
                                        name: 'Help',
                                        href: '#'
                                    },
                                    {
                                        icon: Mail,
                                        name: 'Messages',
                                        href: '#'
                                    },
                                    {
                                        icon: Bell,
                                        name: 'Notifications',
                                        href: '#'
                                    }
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            href={item.href}
                                            className={clsx(
                                                'gray-600 semi-bold',
                                                item.mobile && styles.mobile
                                            )}
                                            onClick={closeFsMenu}
                                        >
                                            
                                            <item.icon />

                                            <span>
                                                {item.name}
                                            </span>

                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={clsx(
                                    styles.logout,
                                    'text-14 bold gray-800'
                                )}
                                onClick={closeFsMenu}
                            >

                                <LogOut />

                                <span>
                                    Logout
                                </span>

                            </button>

                        </div>

                    </div>

                </section>
            )}

        </>
    )
}