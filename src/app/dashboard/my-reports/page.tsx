// libraries
import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'

// components
import Breadcrumbs from '@/components/Breadcrumbs'

// img / svg

// data / utils / db
import { pages } from '@/utils/routes'

// css
import styles from './index.module.scss'

export const metadata = {
	title: 'Dashboard | Platform 360'
}

export default function DashboardMyReports() {
	return (
		<>

			<Breadcrumbs
				breadcrumbs={[
					{
						name: 'Home',
						link: '#'
					},
					{
						name: 'My Reports',
						link: '#'
					}
				]}
			/>
		
			<section className={clsx(styles.banner, 'py-big')}>
				<div className='container container--big'>
					<p className='gray-dark'>
						You don't have any reports yet
					</p>
				</div>
			</section>

		</>
	)
}
