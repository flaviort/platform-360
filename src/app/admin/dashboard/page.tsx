// layouts
import AdminWrapper from '@/layouts/Admin'

// components
import List from './list'

// css
import styles from './index.module.scss'

export default function AdminDashboard() {

	return (
		<AdminWrapper className={styles.page}>

			<section className='pt-smallest pb-smaller bg-purple-dark white'>
				<div className='container container--big'>
					
					<h1 className='text-45 bold'>
						Admin Dashboard
					</h1>

					<p className='mt-half'>
						From here you can manage who has access to the platform.
					</p>
					
				</div>
			</section>

			<List />

		</AdminWrapper>
	)
}
