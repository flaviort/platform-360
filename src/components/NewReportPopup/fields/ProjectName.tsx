'use client'

// libraries
import { useState, useEffect } from 'react'

// components
import Select from '@/components/Form/Select'
import Input from '@/components/Form/Input'
import Textarea from '@/components/Form/Textarea'

// css
import styles from '../index.module.scss'

interface Project {
	id: string
	name: string
	created_at: string
}

export default function ProjectName() {
	const [projects, setProjects] = useState<Project[]>([])
	const [selectedProject, setSelectedProject] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await fetch('/api/proxy?endpoint=/api/projects/me')
				const data = await response.json()
				setProjects(data)
			} catch (error) {
				console.error('Error fetching projects:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchProjects()
	}, [])

	const handleProjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value
		setSelectedProject(value)

		if (value === 'New Project') {
			// Reset the form fields when selecting New Project
			const newProjectNameInput = document.getElementById('newProjectName') as HTMLInputElement
			const projectDescriptionInput = document.getElementById('projectDescription') as HTMLTextAreaElement
			if (newProjectNameInput) newProjectNameInput.value = ''
			if (projectDescriptionInput) projectDescriptionInput.value = ''
		}
	}

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
						onChange={handleProjectChange}
					>
						<option value='' disabled>
							{isLoading ? 'Loading projects...' : 'Select or create one'}
						</option>
						
						{projects.map((project) => (
							<option key={project.id} value={project.name}>
								{project.name}
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