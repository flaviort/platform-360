// libraries
import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'

// css
import styles from './index.module.scss'

// images
import dots from '@/assets/img/dots.png'
import Logo from '@/assets/svg/logo/logo.svg'

// utils
import { pages } from '@/utils/routes'

export default function AccountWrapper({
	children,
	hideBottomLinks = false
}: {
	children: React.ReactNode
	hideBottomLinks?: boolean
}) {
	return (
		<main className={styles.component}>
			<section className={styles.account}>

				<div className={styles.bg}>
					<Image
						src={dots}
						alt=''
						fill
						className='cover'
						priority
						sizes='100vw'
					/>
				</div>

				<div className={clsx(styles.container, 'container')}>

					<div className={styles.top}>
						<Link
							href={pages.home}
							className={styles.logo}
							aria-label='Go to homepage'
						>
							<Logo />
						</Link>
					</div>

					<div className={styles.middle}>
						{children}
					</div>

					<div className={styles.bottom}>
						{!hideBottomLinks && (
							<ul className={clsx(styles.links, 'text-16 medium gray-500')}>

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
						)}
					</div>

				</div>

			</section>
		</main>
	)
}