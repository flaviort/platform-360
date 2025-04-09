// svg
import Twitter from '@/assets/svg/social/twitter.svg'
import Instagram from '@/assets/svg/social/instagram.svg'
import Facebook from '@/assets/svg/social/facebook.svg'

// pages
export const pages = {
	home: '/',
	error: '/404',

	// login area
	account: {
		login: '/account/login',
		register: '/account/register',
		register_pending: '/account/register-pending',
		register_confirmation: '/account/register-confirmation',
		forgot: '/account/forgot-password',
		forgot_confirmation: '/account/forgot-password-confirmation',
		reset_password: '/account/reset-password',
		reset_password_success: '/account/reset-password-success',
		settings: '/account/settings'
	},

	// dashboard
	dashboard: {
		my_reports: '/dashboard/my-reports',
	},

	// admin
	admin: {
		dashboard: '/admin/dashboard'
	},

	// terms, privacy, etc
	terms: '/terms-and-conditions',
	privacy: '/privacy-policy'
}

// social
export const social = {
	twitter: 'https://twitter.com/',
	instagram: 'https://instagram.com/',
	facebook: 'https://www.facebook.com/',
	youtube: 'https://www.youtube.com/'
}

// contact
export const contact = {
	phone: '(000) 000-0000',
	noReply: 'noreply@platform360.ai',
	email: 'info@platform360.ai',
	address: '',
	gmaps: ''
}

// social links
export const socialLinks = [
	{
		icon: Twitter,
		name: 'Twitter',
		href: social.twitter
	}, {
		icon: Facebook,
		name: 'Facebook',
		href: social.facebook
	}, {
		icon: Instagram,
		name: 'Instagram',
		href: social.instagram
	}
]