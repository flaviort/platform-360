// libraries
import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'

// img / svg
import Logo from '@/assets/svg/logo/logo.svg'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'

export default function Footer() {
    return (
        <footer className={clsx(styles.component, 'bg-gray-600 py-small py-md-smaller')}>
            <div className='container relative z2'>

                <div className={clsx(styles.top, 'mb-smaller')}>

                    <Link
                        className={styles.logo}
                        href={pages.home}
                    >
                        <Logo />
                    </Link>

                    <ul className={styles.menu}>
                        {[
                            {
                                text: 'Home',
                                href: '#'
                            }
                        ].map((item, i) => (
                            <li key={i}>
                                <Link href={item.href} className='hover-underline'>
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href='#'
                        className={clsx(styles.donate, 'button button--white text-25')}
                    >
                        Donate Now
                    </Link>

                </div>

                <div className={clsx(styles.bottom, 'text-16 medium gray-light uppercase')}>

                    <p>
                        Copyright © {new Date().getFullYear()}
                    </p>

                    <p>
                        Registered charity in both Canada (No. 81111 6813 RR0001) and the United States (EIN 30-0545486)
                    </p>

                </div>
            </div>
        </footer>
    )
}