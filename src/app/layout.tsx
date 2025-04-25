// libraries
import type { Metadata } from 'next'
import clsx from 'clsx'
import { GoogleAnalytics } from '@next/third-parties/google'

// components
import Guidelines from '@/components/Utils/Guidelines'
import Providers from '@/components/Providers'
import GDPR from '@/components/GDPR'
import FullScreenLoader from '@/components/FullScreenLoader'

// css
import '@/assets/css/normalize.min.css'
import '@/assets/css/bootstrap-grid.min.css'
import '@/assets/css/balloon.min.css'
import '@/assets/scss/main.scss'

// fonts
import { Inter } from 'next/font/google'

const inter = Inter({
	weight: ['400', '500', '600', '700'],
	style: ['normal'],
	subsets: ['latin'],
	variable: '--font-inter'
})

// metadata
export const metadata: Metadata = {
	metadataBase: new URL(`https://www.platform360.ai`),
	alternates: {
        canonical: './',
    },
	title: 'Platform 360 | Data-Driven Insights',
	description: 'Platform 360° provides turnkey data solutions addressing competitive analysis across products and retailers.',
	icons: {
		icon: '/svg/favicon.svg'
	},
	openGraph: {
		title: 'Platform 360 | Data-Driven Insights',
		description: 'Platform 360° provides turnkey data solutions addressing competitive analysis across products and retailers.',
		url: process.env.WEBSITE_URL,
		siteName: 'Platform 360',
		images: [
			{
				url: process.env.WEBSITE_URL + '/img/og-image.png',
				width: 1280,
				height: 628,
				alt: 'Platform 360'
			}
		],
		locale: 'en_US',
		type: 'website'
	}
}

interface RootLayoutProps {
	children: React.ReactNode
}

export default function RootLayout({
	children
}: RootLayoutProps) {
	return (
		<html lang='en-US' className={clsx(inter.className)}>

			<body id='start'>

				<div id='portal'></div>

				<Providers>
					{children}
				</Providers>

				<GDPR />

				<Guidelines />

				<GoogleAnalytics gaId='G-FE8FLM7CTP' />

				<FullScreenLoader />

			</body>

		</html>
	)
}