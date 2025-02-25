// libraries
import clsx from 'clsx'
// components
import Breadcrumbs from '@/components/Breadcrumbs'
import TitlePart from '@/components/TitlePart'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'

export default function DashboardMyReports() {

	return (
		<main className={styles.page}>

			<Breadcrumbs
				breadcrumbs={[
					{
						name: 'Home',
						link: pages.home
					},
					{
						name: 'My Reports',
						link: pages.dashboard.my_reports
					},
					{
						name: 'Lululemon Summer 2025',
						link: '#'
					}
				]}
			/>
		
			<TitlePart
				title='Lululemon Summer 2025'
			/>

			<section className={styles.navigation}>
				<div className='container container--big'>
					<ul>

						<li>
							<button className={clsx(styles.active, 'text-16 gray-400 semi-bold')}>
								Shoe Report
							</button>
						</li>

						<li>
							<button className='text-16 gray-400 semi-bold'>
								Other Report
							</button>
						</li>

						<li>
							<button className='text-16 gray-400 semi-bold'>
								Other Report
							</button>
						</li>

					</ul>
				</div>
			</section>

			<section className={styles.content}>
				<div className='container container--big'>
					<div className={styles.gridWrapper}>

						<div className={clsx(styles.charts, 'relative')}>

							<div className={clsx(styles.bg, 'bg-gray-200')}></div>

							<div className='relative z2'>

							</div>
						</div>

						<div className={styles.information}>
							<div className='relative z2'>

							</div>
						</div>

					</div>
				</div>
			</section>

		</main>
	)
}