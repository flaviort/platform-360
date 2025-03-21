'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'

// img / svg
import Logo from '@/assets/svg/logo/logo.svg'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'

// context
import { useAuth } from '@/contexts/AuthContext'

interface FooterProps {
    internal?: boolean
}

export default function Footer({
    internal
}: FooterProps) {

    const { isAuthenticated } = useAuth()

    return (
        <footer className={clsx(styles.component, 'bg-gray-100 py-smaller py-md-smallest')} data-footer>
            <div className={clsx('container', internal && 'container--big')}>
                <div className={clsx(styles.flex, isAuthenticated && styles.internal)}>

                    <div className={styles.left}>

                        <Link
                            className={styles.logo}
                            href={pages.home}
                        >
                            <Logo />
                        </Link>

                        <p className='text-16 gray-500'>
                            Copyright © {new Date().getFullYear()}
                        </p>

                    </div>

                    <div className={styles.right}>
                        <ul className={clsx(styles.links, 'text-16 gray-500')}>

                            <li>
                                <Link href={pages.terms} className='hover-underline'>
                                    Terms and Conditions
                                </Link>
                            </li>

                            <li>
                                <p className='gray-300 text-12'>
                                    •
                                </p>
                            </li>

                            <li>
                                <Link href={pages.privacy} className='hover-underline'>
                                    Privacy Policy
                                </Link>
                            </li>

                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    )
}