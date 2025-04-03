// components
import Wrapper from './Wrapper'

export const PasswordResetEmail = () => {
	const title = "Platform360 - Your password has been reset"
	const { body_html } = Wrapper({
		title,
		children: `
			<h2 class='p-32 blue bold block' style='color: #267BDD; font-size: 32px; line-height: 40px; font-weight: 600; display: block;'>
				Your password has been reset
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
				Your password has been successfully reset. You can now log in with your new password.
			</p>

			<img
				src='https://platform-360-eight.vercel.app/emails/blank.png'
				alt=''
				width='1'
				height='30'
				class='block h-30'
				style='display: block; width: 1px; height: 30px;'
			/>

			<table cellpadding='0' cellspacing='0' border='0' bgcolor='#5E43DB' style='border-radius: 8px; width: auto;'>
				<tbody>

					<tr>
						<td>
							<img
								src='https://platform-360-eight.vercel.app/emails/blank.png'
								alt=''
								width='1'
								height='10'
								class='block h-10'
								style='display: block; width: 1px; height: 10px;'
							/>
						</td>
					</tr>

					<tr>
						<td align='center'>
							<table>
								<tbody>
									<tr>

										<td>
											<img
												src='https://platform-360-eight.vercel.app/emails/blank.png'
												alt=''
												width='30'
												height='1'
												class='block w-30'
												style='display: block; width: 30px; height: 1px;'
											/>
										</td>

										<td>
											<a href='https://platform-360-eight.vercel.app/' style='display: block; font-size: 18px; line-height: 26px; color: #ffffff; text-decoration: none; font-weight: 600; font-family: Arial, sans-serif'>
												Login
											</a>
										</td>

										<td>
											<img
												src='https://platform-360-eight.vercel.app/emails/blank.png'
												alt=''
												width='30'
												height='1'
												class='block w-30'
												style='display: block; width: 30px; height: 1px;'
											/>
										</td>

									</tr>
								</tbody>
							</table>
						</td>
					</tr>

					<tr>
						<td>
							<img
								src='https://platform-360-eight.vercel.app/emails/blank.png'
								alt=''
								width='1'
								height='10'
								class='block h-10'
								style='display: block; width: 1px; height: 10px;'
							/>
						</td>
					</tr>

				</tbody>
			</table>

			<img
				src='https://platform-360-eight.vercel.app/emails/blank.png'
				alt=''
				width='1'
				height='30'
				class='block h-30'
				style='display: block; width: 1px; height: 30px;'
			/>

			<p class='p-18 black block' style='color: #222; font-size: 18px; line-height: 26px; display: block;'>
				If you have any questions or need assistance, please contact us at <a href='mailto:info@platform360.ai' class='black bold'><b>info@platform360.ai</b></a>.
			</p>
		`
	})

	const body_text = `
		Your password has been reset

		Your password has been successfully reset. You can now log in with your new password.

		Login to your account at https://platform-360-eight.vercel.app/
		
		If you have any questions or need assistance, please contact us at info@platform360.ai.

		Best regards,
		The Platform360 Team
	`

	return {
		subject: title,
		body_html,
		body_text
	}
} 