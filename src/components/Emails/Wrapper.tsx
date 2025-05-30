interface WrapperProps {
	title: string
	children: string
}

export default function Wrapper({
	title,
	children
}: WrapperProps) {
	return {
		subject: title,
		body_html: `
			<!DOCTYPE html>

			<html xmlns='http://www.w3.org/1999/xhtml'>

				<head>
					<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
					<meta charset='UTF-8'>
					<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
					
					<title>
						${title}
					</title>

					<style type='text/css'>

						body, table, td, p, a { -ms-text-size-adjust: 100%!important; -webkit-text-size-adjust: 100%!important; }
						table, tr, td { border-spacing: 0!important; mso-table-lspace: 0px!important; mso-table-rspace: 0pt!important; border-collapse: collapse!important; mso-line-height-rule: exactly!important; }

						p {
							margin: 0;
							padding: 0;
						}

						html,
						body {
							font-family: 'Arial', sans-serif;
							-webkit-font-smoothing: antialiased;
						}

						body {
							margin: 0 auto;
							text-align: center;
							padding: 0;
						}

						.block {
							display: block;
							width: 100%;
						}

						img {
							display: block;
							max-width: 100%;
						}

						.align-top { vertical-align: top; }
						.align-bottom { vertical-align: bottom; }
						.text-right { text-align: right; }

						.p-14 { font-size: 14px; line-height: 18px; }
						.p-18 { font-size: 18px; line-height: 26px; }
						.p-32 { font-size: 32px; line-height: 40px; }

						.w-20 { width: 20px; }
						.w-30 { width: 30px; }
						.w-30 { width: 30px; }
						.w-50 { width: 50px; }
						.w-70 { width: 70px; }

						.h-5 { height: 5px; }
						.h-7 { height: 7px; }
						.h-10 { height: 10px; }
						.h-20 { height: 20px; }
						.h-30 { height: 30px; }
						.h-50 { height: 50px; }

						.purple { color: #5E43DB; }
						.blue { color: #267BDD; }
						.black { color: #222; }
						.gray { color: #6A6A6A; }
						.red { color: #B50000; }

						.regular { font-weight: 400; }
						.bold { font-weight: 600; }

						@media only screen and (max-width: 690px) {
							p { 
								box-sizing: border-box!important;
								width: 100%!important;
								margin-left: 0!important;
								margin-right: 0!important;
							}

							table {
								width: 100%;
								max-width: 100%;
							}

							.p-18 {
								font-size: 16px!important;
								line-height: 24px!important;
							}

							.p-32 {
								font-size: 26px!important;
								line-height: 32px!important; 
							}

							.w-20 { width: 10px!important; }
							.w-30 { width: 20px!important; }
							.w-50 { width: 30px!important; }
							.w-70 { width: 40px!important; }

							.h-20 { height: 10px!important; }
							.h-30 { height: 20px!important; }
							.h-50 { height: 30px!important; }
						}

					</style>

				</head>

				<body bgcolor='#F4F4F4'>
					<center>
						<table border='0' cellpadding='0' cellspacing='0' width='100%' bgcolor='#F4F4F4'>
							<tr>
								<td align='center' valign='top'>
									<table width='640' cellpadding='0' cellspacing='0' border='0' align='center' bgcolor='#F4F4F4' style='background-color: #F4F4F4;'>
										<tbody>

											<tr>
												<td>
													<div class='h-30' style='display: block; height: 30px;'></div>
												</td>
											</tr>

											<tr>
												<td>
													<table
														cellpadding='0'
														cellspacing='0'
														border='0'
														align='center'
														bgcolor='#fff'
														style='position: relative; overflow: hidden; width: 100%; border-radius: 10px; background-color: #fff;'
													>
														<tbody>
															<tr>

																<td class='w-70' style='width: 70px;'></td>

																<td>
																	<table
																		cellpadding='0'
																		cellspacing='0'
																		border='0'
																		align='center'
																		style='width: 100%; text-align: left;'
																	>
																		<tbody>

																			<tr>
																				<td>
																					<img
																						src='https://platform-360-eight.vercel.app/emails/blank.png'
																						alt=''
																						width='1'
																						height='50'
																						class='block h-50'
																						style='display: block; width: 1px; height: 50px;'
																					/>
																				</td>
																			</tr>
																			
																			<tr>
																				<td>
																					<a href='https://platform360.ai/' style='display: block; width: 221px; height: 32px;'>
																						<img
																							src='https://platform-360-eight.vercel.app/emails/logo.png'
																							alt='Platform360'
																							width='221'
																							height='32'
																							style='display: block; width: 221px; height: 32px;'
																						/>
																					</a>
																				</td>
																			</tr>

																			<tr>
																				<td>

																					<img
																						src='https://platform-360-eight.vercel.app/emails/blank.png'
																						alt=''
																						width='1'
																						height='30'
																						class='block h-30'
																						style='display: block; width: 1px; height: 30px;'
																					/>

																					${children}

																				</td>
																			</tr>

																			<tr>
																				<td>

																					<img
																						src='https://platform-360-eight.vercel.app/emails/blank.png'
																						alt=''
																						width='1'
																						height='50'
																						class='block h-50'
																						style='display: block; width: 1px; height: 50px;'
																					/>

																					<img
																						src='https://platform-360-eight.vercel.app/emails/line.png'
																						alt='Line'
																						width='500'
																						height='1'
																						style='display: block; width: 500px; height: 1px; max-width: 100%;'
																					/>

																					<img
																						src='https://platform-360-eight.vercel.app/emails/blank.png'
																						alt=''
																						width='1'
																						height='30'
																						class='block h-30'
																						style='display: block; width: 1px; height: 30px;'
																					/>

																					<table
																						cellpadding='0'
																						cellspacing='0'
																						border='0'
																						align='center'
																						bgcolor='#fff'
																						style='width: 100%; text-align: left;'
																					>
																						<tbody>
																							<tr>

																								<td class='align-top' style='vertical-align: top;'>

																									<a href='https://platform360.ai/' style='display: block; width: 150px; height: 22px;'>
																										<img src='https://platform-360-eight.vercel.app/emails/logo.png' alt='Platform360' width='150' height='22' />
																									</a>

																									<br />

																									<p class='p-14 black' style='color: #222; font-size: 14px; line-height: 18px; display: block;'>
																										Platform360 LLC,<br />
																										8 Hanover Quay,<br />
																										Dublin 2, Ireland
																									</p>

																								</td>

																								<td class='text-right align-top' style='text-align: right; vertical-align: top;'>
																									<a href='mailto:info@platform360.ai' class='p-14 black' style='text-decoration: none!important; color: #222; font-size: 14px; line-height: 18px; display: block;'>
																										info@platform360.ai
																									</a>
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
																						height='50'
																						class='block h-50'
																						style='display: block; width: 1px; height: 50px;'
																					/>
																				</td>
																			</tr>

																		</tbody>
																	</table>
																</td>

																<td class='w-70' style='width: 70px;'></td>

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
														height='30'
														class='block h-30'
														style='display: block; width: 1px; height: 30px;'
													/>
												</td>
											</tr>

										</tbody>
									</table>
								</td>
							</tr>
						</table>
					</center>

				</body>
			</html>
		`
	}
} 