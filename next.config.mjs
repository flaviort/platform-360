import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	sassOptions: {
		includePaths: [path.join(__dirname, 'src/assets/scss')],
		additionalData: `@use 'variables.scss' as *;`,
		silenceDeprecations: ['legacy-js-api']
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack(config) {
		const fileLoaderRule = config.module.rules.find((rule) =>
		  	rule.test?.test?.('.svg')
		)

		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/
			},
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
				use: [{
					loader: '@svgr/webpack',
					options: {
						svgoConfig: {
							plugins: [{
								name: 'preset-default',
								params: {
									overrides: {
										removeViewBox: false
									}
								}
							}]
						}
					}
				}]
			}
		)

		fileLoaderRule.exclude = /\.svg$/i
	
		return config
	}
}

export default nextConfig