'use client'

// libraries
import clsx from 'clsx'
import Link from 'next/link'

// css
import styles from './index.module.scss'

// img / svg
import Logo from '@/assets/svg/logo/logo.svg'
import { LogOut } from 'lucide-react'

// utils
import { pages } from '@/utils/routes'

// context
import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@/contexts/UserContext'

interface AdminWrapperProps {
	children: React.ReactNode
	className?: string
}

export default function AdminWrapper({
	children,
	className
}: AdminWrapperProps) {

	const { userData } = useUser()
    const { logout, isAuthenticated } = useAuth()

	return (
		<main className={clsx(className, styles.page)}>
			
			<section className={styles.topMenu}>
                <div className='container container--big'>

                    <div className={clsx(styles.flex, 'white')}>

                        <div className={styles.left}>

                            <Link
                                href={pages.home}
                                aria-label='Go to homepage'
                                className={styles.logo}
                            >
                                <Logo />
                            </Link>

                        </div>

						<div className={styles.right}>
							<button
								className='button button--hollow-white button--small text-14'
								onClick={logout}
								type='button'
							>

								<LogOut />

								<span>
									Logout
								</span>

							</button>
						</div>

                    </div>

                </div>
            </section>

			{children}

		</main>
	)
}