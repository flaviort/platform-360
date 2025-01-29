// libraries
import type { Metadata } from 'next'
import clsx from 'clsx'
import { GoogleAnalytics } from '@next/third-parties/google'

// components
import Guidelines from '@/components/Utils/Guidelines'

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

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {

	// schema
	const jsonLd = {
		"@context": "https://schema.org/",
		"@type": "Organization",
		"name": "Platform 360",
		"logo": "https://platform360.com/img/logo.png",
		"url": "https://platform360.com",
		"worksFor": {
			"@type": "Organization",
			"name": "Platform 360"
		},
		"description": "Platform 360° provides turnkey data solutions addressing competitive analysis across products and retailers.",
		"keywords": [
			"Data-Driven Insights",
			"Competitive Analysis",
			"Emerging Trends",
			"Historical Data",
			"Consumer Preferences",
			"AI (Artificial Intelligence)",
			"Market Trends",
			"Product Development",
			"Customizable Reports",
			"Actionable Solutions"
		]
	}

	return (
		<html lang='en-US' className={clsx(inter.className)}>

			<body id='start'>

				<div id='main-content'>
					{children}
				</div>

				<Guidelines />

				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>

				<GoogleAnalytics gaId='G-FE8FLM7CTP' />

			</body>

		</html>
	)
}