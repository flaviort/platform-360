// components
import Wrapper from './Wrapper'

interface RegisterEmailProps {
	firstName: string
}

export default function RegisterEmail({
	firstName
}: RegisterEmailProps) {
	const title = "Platform360 - Welcome onboard"
	const body_html = `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				<title>${title}</title>
			</head>
			<body>
				<h2 style="color: #267BDD; font-size: 32px; line-height: 40px; font-weight: 600;">
					Hi ${firstName}, welcome onboard
				</h2>

				<p style="color: #222; font-size: 18px; line-height: 26px;">
					Thanks for signing up for <b>Platform360°!</b> We're excited to have you here.<br /><br />

					Your account has been created, but it's still pending activation. Our team is reviewing your information, and this usually takes 1-3 business days.<br /><br />
					
					If you need your account up and running sooner, feel free to email us at <a href="mailto:info@platform360.ai" style="color: #222; font-weight: 600;">info@platform360.ai</a>, and we'll do our best to fast-track the process.<br /><br />
					
					Looking forward to seeing you on Platform360!
				</p>
			</body>
		</html>
	`

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