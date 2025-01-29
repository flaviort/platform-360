// svg
import Twitter from '@/assets/svg/social/twitter.svg'
import Instagram from '@/assets/svg/social/instagram.svg'
import Facebook from '@/assets/svg/social/facebook.svg'

// pages
export const pages = {
	home: '/',
	error: '/404',

	// login area
	login: '/login',
	register: '/register',
	forgot: '/forgot-password',
	forgot_confirmation: '/forgot-password-confirmation',
	reset_password: '/reset-password',
	reset_password_success: '/reset-password-success',

	// dashboard

	// terms, privacy, etc
	terms: '/terms-of-use',
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