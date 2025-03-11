'use client'

// libraries
import { useState } from 'react'

// components
import Select from '@/components/Form/Select'
import Input from '@/components/Form/Input'

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
					<label htmlFor='report-name' className='text-16 semi-bold'>
						Project <span className='red'>*</span>
					</label>
				</div>

				<div className={styles.input}>
					<Select
						defaultValue=''
						required
						label='Project'
						name='project'
						hideLabel
						id='report-project'
						onChange={(e) => setSelectedProject(e.target.value)}
					>
						
                        <option value='' disabled>
                            Select or create one
                        </option>
						
                        {projects.map((projectGroup) => (
							<option key={projectGroup} value={projectGroup}>
								{projectGroup}
							</option>
						))}

						<option value='New Project'>
                            New Project
                        </option>

					</Select>
				</div>

			</div>

			{selectedProject === 'New Project' && (
				<div className={styles.group}>

					<div className={styles.label}>
						<label htmlFor='report-name' className='text-16 semi-bold'>
							Project Name <span className='red'>*</span>
						</label>
					</div>

					<div className={styles.input}>
						<Input
							placeholder='Type here'
							required
							label='New Project Name'
							name='new-project-name'
							hideLabel
							id='new-project-name'
							type='text'
						/>
					</div>

				</div>
			)}
        </>
	)
}