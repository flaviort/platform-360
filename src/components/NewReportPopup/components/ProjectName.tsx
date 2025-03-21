'use client'

// libraries
import { useState } from 'react'

// components
import Select from '@/components/Form/Select'
import Input from '@/components/Form/Input'
import Textarea from '@/components/Form/Textarea'

// css
import styles from '../index.module.scss'

// db
import { fakeProjects } from '@/db/fake-projects'

// functions
import { getProjects } from '@/utils/functions'

export default function ProjectName() {

    const projects = getProjects(fakeProjects)
	const [selectedProject, setSelectedProject] = useState('')

	return (
        <>
		    <div className={styles.group}>

				<div className={styles.label}>
					<label htmlFor='selectedProject' className='text-16 semi-bold'>
						Project <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Select
						defaultValue=''
						required
						label='Project'
						name='selectedProject'
						hideLabel
						id='selectedProject'
						onChange={(e) => setSelectedProject(e.target.value)}
					>
						
                        <option value='' disabled>
                            Select or create one
                        </option>
						
                        {projects.map((item) => (
							<option key={item} value={item}>
								{item}
							</option>
						))}

						<option value='New Project'>
                            New Project
                        </option>

					</Select>
				</div>

			</div>

			{selectedProject === 'New Project' && (
				<>
					<div className={styles.group}>

						<div className={styles.label}>
							<label htmlFor='newProjectName' className='text-16 semi-bold'>
								Project Name <span className='red'>*</span>
							</label>
						</div>

						<div className={styles.input}>
							<Input
								placeholder='Type here'
								required
								label='New Project Name'
								name='newProjectName'
								hideLabel
								id='newProjectName'
								type='text'
							/>
						</div>

					</div>

					<div className={styles.group}>

						<div className={styles.label}>
							<label htmlFor='projectDescription' className='text-16 semi-bold'>
								Project Description <span className='red'>*</span>
							</label>
						</div>

						<div className={styles.input}>
							<Textarea
								placeholder='Type here'
								required
								label='Project Description'
								name='projectDescription'
								hideLabel
								id='projectDescription'
								maxLength={250}
							/>
						</div>

					</div>

					<div className={styles.line}></div>

				</>
			)}
        </>
	)
}