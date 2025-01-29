// libraries
import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'

// components

// img / svg

// data / utils / db
import { pages } from '@/utils/routes'
import { placeholder } from '@/utils/functions'

// css
import styles from './index.module.scss'

export const metadata = {
	title: 'Dashboard | Platform 360'
}

export default function Home() {
	return (
		<main className={styles.page}>

			<section className={clsx(styles.banner, 'bg-gray-800 py-small')}>
				<div className="container">
					asdadas
				</div>
			</section>

		</main>
	)
}
