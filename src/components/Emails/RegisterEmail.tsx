// components
import Wrapper from './Wrapper'

interface RegisterEmailProps {
	firstName: string
}

export default function RegisterEmail({
	firstName
}: RegisterEmailProps) {
	const title = "Platform360 - Welcome onboard"
	const { body_html } = Wrapper({
		title,
		children: `
			<h2 class='p-32 blue bold block' style='color: #267BDD; font-size: 32px; line-height: 40px; font-weight: 600; display: block;'>
				Hi ${firstName}, welcome onboard
			</h2>

			<img
				src='https://platform-360-eight.vercel.app/emails/blank.png'
				alt=''
				width='1'
				height='5'
				class='block h-5'
				style='display: block; width: 1px; height: 5px;'
			/>

			<p class='p-18 black block' style='color: #222; font-size: 18px; line-height: 26px; display: block;'>
				Thanks for signing up for <b>Platform360°!</b> We're excited to have you here.<br /><br />

				Your account has been created, but it's still pending activation. Our team is reviewing your information, and this usually takes 1-3 business days.<br /><br />
				
				If you need your account up and running sooner, feel free to email us at <a href='mailto:info@platform360.ai' class='black bold'>info@platform360.ai</a>, and we'll do our best to fast-track the process.<br /><br />
				
				Looking forward to seeing you on Platform360!
			</p>
		`
	})

	const body_text = `
		Hi ${firstName}, welcome onboard

		Thanks for signing up for Platform360°! We're excited to have you here.

		Your account has been created, but it's still pending activation. Our team is reviewing your information, and this usually takes 1-3 business days.
		
		If you need your account up and running sooner, feel free to email us at info@platform360.ai, and we'll do our best to fast-track the process.
		
		Looking forward to seeing you on Platform360!

		Best regards,
		The Platform360 Team
	`

	return {
		subject: title,
		body_html,
		body_text
	}
} 