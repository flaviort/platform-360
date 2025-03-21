// libraries
import clsx from 'clsx'
import Link from 'next/link'

// svg
import OtherAstro from '@/assets/svg/other/astro.svg'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'

export const metadata = {
	title: 'Error 404 | Platform 360'
}

export default function Error404() {
	return (
		<main className={clsx(styles.page, 'bg-gray-900')}>
			<section className='white'>
				<div className='container'>
					<div className={clsx(styles.flex, 'py-medium')}>

						<OtherAstro />

						<p className='text-16 gray-300'>
							Error 404
						</p>

						<h1 className='text-95 blue bold'>
							Oooops!
						</h1>

						<p>
							The page you are looking for does not exist.
						</p>

						<Link href={pages.home} className='button button--hollow-white text-16'>
							Go to Home
						</Link>

					</div>
				</div>
			</section>
		</main>
	)
}
