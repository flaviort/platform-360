// components
import Wrapper from './Wrapper'

export const NewAccountEmail = () => {
	const title = "Platform360 - There's a new account on Platform360"
	const { body_html } = Wrapper({
		title,
		children: `
			<h2 class='p-32 blue bold block' style='color: #267BDD; font-size: 32px; line-height: 40px; font-weight: 600; display: block;'>
				Hooray! Someone has just signed up
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
				Hey there, it seems that someone just signed up for a new account on Platform360. Head over to the admin dashboard to review it.
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
												Admin Dashboard
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
				Don't forget to contact the user to welcome them to Platform360.
			</p>
		`
	})

	const body_text = `
		Hooray! Someone has just signed up

		Hey there, it seems that someone just signed up for a new account on Platform360. Head over to the admin dashboard to review it.

		Visit the admin dashboard at https://platform-360-eight.vercel.app/
		
		Don't forget to contact the user to welcome them to Platform360.

		Best regards,
		The Platform360 Team
	`

	return {
		subject: title,
		body_html,
		body_text
	}
} 