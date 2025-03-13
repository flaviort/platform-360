'use client'

import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

// components
import Select from '@/components/Form/Select'
import Input from '@/components/Form/Input'

// css
import styles from '../index.module.scss'

export default function ProjectName() {
	const [projects, setProjects] = useState<string[]>([])
	const [selectedProject, setSelectedProject] = useState('')
	const { setValue, register } = useFormContext()

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await fetch('/api/projects')
				const data = await response.json()
				
				if (data.success) {
					const uniqueProjects = [...new Set(
						data.data
							.filter((project: any) => project.name && project.name.trim() !== '')
							.map((project: any) => project.name)
					)] as string[]
					
					setProjects(uniqueProjects)
				}
			} catch (error) {
				console.error('Error fetching projects:', error)
			}
		}

		fetchProjects()
	}, [])

	const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value
		setSelectedProject(value)
		
		if (value === 'New Project') {
			setValue('selectedProject', '')
			setValue('projectName', '')
		} else {
			setValue('selectedProject', value)
			setValue('projectName', value)
		}
	}

	useEffect(() => {
		if (selectedProject !== 'New Project' && selectedProject) {
			setValue('projectName', selectedProject)
		}
	}, [selectedProject, setValue])

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
						defaultValue={selectedProject || ''}
						required={!selectedProject || selectedProject !== 'New Project'}
						label='Project'
						name='selectedProject'
						hideLabel
						id='selectedProject'
						onChange={handleProjectChange}
					>

						<option value='' disabled>
							Select or create one
						</option>
						
						{projects.map((projectName) => (
							<option key={projectName} value={projectName}>
								{projectName}
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
						<label htmlFor='projectName' className='text-16 semi-bold'>
							Project Name <span className='red'>*</span>
						</label>
					</div>

					<div className={styles.input}>
						<Input
							placeholder='Type here'
							required={selectedProject === 'New Project'}
							label='Project Name'
							name='projectName'
							hideLabel
							id='projectName'
							type='text'
							onChange={(e) => setValue('projectName', e.target.value)}
						/>
					</div>

				</div>
			)}

			<div className={styles.line}></div>
		</>
	)
}