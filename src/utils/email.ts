interface EmailData {
	to: string | string[]
	from: string
	subject: string
	body_html: string
	body_text: string
}

interface EmailResponse {
	success: boolean
	message?: string
	error?: string
}

export async function sendEmail(data: EmailData): Promise<EmailResponse> {
	try {
		const response = await fetch('/api/proxy?endpoint=/api/mail/send-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				to: Array.isArray(data.to) ? data.to : [data.to],
				from: data.from,
				subject: data.subject,
				body_html: data.body_html,
				body_text: data.body_text
			})
		})

		const result = await response.json()
		console.log('Email API Response:', result)

		if (!response.ok) {
			// Handle array of validation errors
			if (Array.isArray(result.message)) {
				throw new Error(result.message[0]?.msg || 'Validation error')
			}
			
			// Handle AWS SES verification error
			if (result.message?.includes('Email address is not verified')) {
				throw new Error('Email service is currently being configured. Email address is not verified.')
			}
			
			// Handle single error message
			throw new Error(result.message || result.detail || 'Failed to send email')
		}

		return {
			success: true,
			message: result.message || 'Email sent successfully'
		}
	} catch (error) {
		console.error('Error sending email:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to send email'
		}
	}
} 