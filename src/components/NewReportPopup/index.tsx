'use client'

// libraries
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'

// components
import Portal from '@/components/Utils/Portal'
import usePopoverPosition from '@/components/Utils/Portal/usePopoverPosition'
import { Form, Input, Select, Checkbox, Textarea, Submit } from '@/components/Form'

// svg
import { X, ChevronRight } from 'lucide-react'

// css
import styles from './index.module.scss'

interface PopupShop360Props {
	icon: React.ComponentType<any>
	text: string
}

export default function PopupShop360({
	icon: Icon,
	text
}: PopupShop360Props) {

	const [optionsSub, setOptionsSub] = useState(false)
	const optionsSubRef = useRef<HTMLDivElement>(null)
	const popoverRef = useRef<HTMLDivElement>(null)

	const popoverStyle = usePopoverPosition(optionsSubRef, optionsSub)

	const openNewReportPopup = () => {
		setOptionsSub((prev) => !prev)
	}

	const closeNewReportPopup = () => {
		setOptionsSub(false)
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && optionsSub) {
				closeNewReportPopup()
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (!optionsSub) return
	  
			const target = e.target as Node

			// if clicked inside toggle / buttons
			if (optionsSubRef.current?.contains(target)) {
				return
			}
			
			// if click inside the popover itself
			if (popoverRef.current?.contains(target)) {
				return
			}

			closeNewReportPopup()
		}
	  
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [optionsSub])

	useEffect(() => {
		if (optionsSub) {
			document.body.classList.add('no-scroll')
		} else {
			document.body.classList.remove('no-scroll')
		}
	}, [optionsSub])

	return (
		<>
									
			<button
				className='text-14 bold'
				onClick={openNewReportPopup}
			>

				<Icon />

				<span>
					{text}
				</span>

			</button>

			<AnimatePresence>
				{optionsSub && (
					<Portal>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: .3,
								ease: 'easeInOut' 
							}}
							ref={popoverRef}
							className={styles.component}
						>
							<div
								className={styles.bg}
								onClick={closeNewReportPopup}
							/>

							<motion.div
								initial={{ transform: 'translateX(100%)' }}
								animate={{ transform: 'none' }}
								exit={{ transform: 'translateX(100%)' }}
								transition={{
									duration: .3,
									ease: 'easeInOut' 
								}}
								className={styles.wrapper}
								style={popoverStyle}
							>
								<Form
									className={styles.form}
									endpoint='/api/dashboard/new-report'
									onSuccess={() => console.log('sucess')}
									onError={() => console.log('error')}
								>

									<div className={styles.top}>

										<div className={styles.left}>

											<p className='text-25 bold'>
												New Report
											</p>

											<ChevronRight />

											<p className='text-25 bold purple'>
												{text}
											</p>

										</div>

										<button
											className={styles.close}
											onClick={closeNewReportPopup}
										>
											<X />
										</button>

									</div>

									<div className={styles.middle}>

										<div className={styles.group}>

											<div className={styles.label}>
												<label htmlFor='report-name' className='text-16 semi-bold'>
													Report Name <span className='red'>*</span>
												</label>
											</div>

											<div className={styles.input}>
												<Input
													placeholder='Type here'
													required
													label='Report Name'
													hideLabel
													id='report-name'
													type='text'
												/>
											</div>

										</div>

										<div className={styles.group}>

											<div className={styles.label}>
												<label htmlFor='report-category' className='text-16 semi-bold'>
													Category <span className='red'>*</span>
												</label>
											</div>

											<div className={styles.input}>
												<Select
													defaultValue=''
													required
													label='Category'
													hideLabel
													id='report-category'
												>
													<option value=''>Select...</option>
													<option value='Category 1'>Category 1</option>
													<option value='Category 2'>Category 2</option>
													<option value='Category 3'>Category 3</option>
												</Select>
											</div>

										</div>

										<div className={styles.group}>

											<div className={styles.label}>
												<label htmlFor='report-retailers' className='text-16 semi-bold'>
													Retailers <span className='red'>*</span>
												</label>
											</div>

											<div className={styles.input}>
												<Select
													defaultValue=''
													required
													label='Retailers'
													hideLabel
													id='report-retailers'
												>
													<option value=''>Select...</option>
													<option value='Retailer 1'>Retailer 1</option>
													<option value='Retailer 2'>Retailer 2</option>
													<option value='Retailer 3'>Retailer 3</option>
												</Select>
											</div>

										</div>

										<div className={styles.group}>

											<div className={styles.label}>
												<label htmlFor='report-brands' className='text-16 semi-bold'>
													Brands <span className='red'>*</span>
												</label>
											</div>

											<div className={styles.input}>
												<Input
													placeholder='Type here'
													required
													label='Brands'
													hideLabel
													id='report-brands'
													type='text'
												/>
											</div>

										</div>

										<div className={styles.group}>

											<div className={styles.label}>
												<label htmlFor='report-include-images' className='text-16 semi-bold'>
													Inlcude Images
												</label>
											</div>

											<div className={clsx(styles.input, styles.checkboxes)}>
												<Checkbox
													type='checkbox'
													id='report-include-images'
													name='Inlcude Images'
													label='Yes'
												/>
											</div>

										</div>

										<div className={styles.group}>

											<div className={styles.label}>
												<label className='text-16 semi-bold'>
													Genders <span className='red'>*</span>
												</label>
											</div>

											<div className={clsx(styles.input, styles.checkboxes)}>

												<Checkbox
													type='checkbox'
													id='report-genders-men'
													name='Genders'
													label="Men's"
													required
												/>

												<Checkbox
													type='checkbox'
													id='report-genders-women'
													name='Genders'
													label="Women's"
													required
												/>

												<Checkbox
													type='checkbox'
													id='report-genders-kids'
													name='Genders'
													label="Kids"
													required
												/>

											</div>

										</div>

										<div className={styles.group}>

											<div className={styles.label}>
												<label htmlFor='report-year-pulled' className='text-16 semi-bold'>
													Year Pulled <span className='red'>*</span>
												</label>
											</div>

											<div className={styles.input}>
												<Select
													defaultValue=''
													required
													label='Year Pulled'
													hideLabel
													id='report-year-pulled'
												>
													<option value=''>Select...</option>
													{['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989', '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981', '1980'].map((item, i) => (
														<option value={item} key={i}>
															{item}
														</option>	
													))}
												</Select>
											</div>

										</div>

										<div className={styles.group}>

											<div className={styles.label}>
												<label htmlFor='report-month-pulled' className='text-16 semi-bold'>
													Month Pulled <span className='red'>*</span>
												</label>
											</div>

											<div className={styles.input}>
												<Select
													defaultValue=''
													required
													label='Month Pulled'
													hideLabel
													id='report-month-pulled'
												>
													<option value=''>Select...</option>
													<option value='January'>January</option>	
													<option value='February'>February</option>	
													<option value='March'>March</option>	
													<option value='April'>April</option>	
													<option value='May'>May</option>	
													<option value='June'>June</option>	
													<option value='July'>July</option>	
													<option value='August'>August</option>	
													<option value='September'>September</option>	
													<option value='October'>October</option>	
													<option value='November'>November</option>	
													<option value='December'>December</option>
												</Select>
											</div>

										</div>

										<div className={styles.group}>

											<div className={styles.label}>
												<label className='text-16 semi-bold'>
													Type <span className='red'>*</span>
												</label>
											</div>

											<div className={clsx(styles.input, styles.checkboxes)}>

												<Checkbox
													type='radio'
													id='report-type-instore'
													name='Type'
													label='Instore'
													required
												/>

												<Checkbox
													type='radio'
													id='report-type-online'
													name='Type'
													label='Online'
													required
												/>

												<Checkbox
													type='radio'
													id='report-type-both'
													name='Type'
													label='Both'
													required
												/>

											</div>

										</div>

										<div className={styles.group}>

											<div className={styles.label}>
												<label htmlFor='report-goal' className='text-16 semi-bold'>
													Goal <span className='red'>*</span>
												</label>
											</div>

											<div className={styles.input}>
												<Textarea
													placeholder='Type here'
													required
													label='Goal'
													hideLabel
													id='report-goal'
													maxLength={250}
												/>

												<p className={clsx(styles.helper, 'text-12 gray-400')}>
													Max. 250 characters
												</p>

											</div>

										</div>

									</div>

									<div className={styles.bottom}>
										<Submit
											style='gradient-blue'
											text='Create Report'
											className={styles.submit}
										/>
									</div>

								</Form>
							</motion.div>
						</motion.div>
					</Portal>
				)}
			</AnimatePresence>

		</>
	)
}