// components

// img / svg
//import banner from '@/assets/img/banner-404.jpg'

// css
import styles from './index.module.scss'

// utils
import { pages } from '@/utils/routes'

export const metadata = {
	title: 'Error 404 | Platform 360'
}

export default function Error404() {
	return (
		<main className={styles.page}>
			<section>
				error 404
			</section>
		</main>
	)
}
