export interface CreateReportData {
	name: string
	product_type: 'Shop360' | 'Feedback360' | 'Insight360' | 'Demand360'
	category_id: string
	status: boolean
	goal: string
	project_id: string
	
	// shop360 specific fields
	retailers?: string[]
	brands?: string[]
	genders?: string[]
	type?: 'instore' | 'online' | 'both'
	include_images?: boolean
	time_period?: string | null
	audience_size?: string
	age?: string
	questions?: string[]
	price?: number
}

interface ProjectAndCategoryIds {
	projectId: string
	categoryId: string
}

export async function getProjectAndCategoryIds(data: { selectedProject: string, newProjectName?: string, category: string }): Promise<ProjectAndCategoryIds> {
	const token = localStorage.getItem('auth_token')
	if (!token) {
		throw new Error('Authentication required')
	}

	let projectId = ''
	let projectName = data.selectedProject

	// If creating a new project, create it first
	if (data.selectedProject === 'New Project') {
		const newProjectResponse = await fetch('/api/proxy?endpoint=/api/projects', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: data.newProjectName
			})
		})

		if (!newProjectResponse.ok) {
			const errorData = await newProjectResponse.json()
			throw new Error(errorData.detail || 'Failed to create new project')
		}

		const newProject = await newProjectResponse.json()
		projectId = newProject.id
		projectName = newProject.name
	} else {
		// Get project ID from the selected project
		const projectsResponse = await fetch('/api/proxy?endpoint=/api/projects/me', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		if (!projectsResponse.ok) {
			throw new Error('Failed to fetch projects')
		}
		const projects = await projectsResponse.json()
		const selectedProject = projects.find((p: any) => p.name === projectName)
		if (!selectedProject) {
			throw new Error('Selected project not found')
		}
		projectId = selectedProject.id
	}

	// Get category ID from the selected category
	const categoriesResponse = await fetch('/api/proxy?endpoint=/api/categories', {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})
	if (!categoriesResponse.ok) {
		throw new Error('Failed to fetch categories')
	}
	const categories = await categoriesResponse.json()
	const selectedCategory = categories.find((c: any) => c.name === data.category)
	if (!selectedCategory) {
		throw new Error('Selected category not found')
	}

	return {
		projectId,
		categoryId: selectedCategory.id
	}
}

export function validateReportData(data: CreateReportData): void {
	// Validate required fields
	if (!data.name) {
		throw new Error('Report name is required')
	}
	if (!data.product_type) {
		throw new Error('Product type is required')
	}
	if (!data.category_id) {
		throw new Error('Category is required')
	}
	if (!data.project_id) {
		throw new Error('Project is required')
	}
	if (!data.goal) {
		throw new Error('Goal is required')
	}

	// Validate product-specific fields
	switch (data.product_type) {
		case 'Shop360':
			if (!data.retailers?.length) {
				throw new Error('At least one retailer must be selected')
			}
			if (!data.brands?.length) {
				throw new Error('At least one brand must be selected')
			}
			if (!data.genders?.length) {
				throw new Error('At least one gender must be selected')
			}
			if (!data.type) {
				throw new Error('Type must be selected')
			}
			break
		case 'Demand360':
			// Add Demand360-specific validation if needed
			break
		case 'Insight360':
			if (!data.brands?.length) {
				throw new Error('At least one brand must be selected')
			}
			if (!data.genders?.length) {
				throw new Error('At least one gender must be selected')
			}
			break
		case 'Feedback360':
			if (!data.audience_size) {
				throw new Error('Audience size is required')
			}
			if (!data.genders?.length) {
				throw new Error('At least one gender must be selected')
			}
			if (!data.age) {
				throw new Error('Age is required')
			}
			if (!data.retailers?.length) {
				throw new Error('At least one retailer must be selected')
			}
			if (!data.questions?.length) {
				throw new Error('At least one question is required')
			}
			if (!data.price) {
				throw new Error('Price is required')
			}
			break
		default:
			throw new Error(`Unknown product type: ${data.product_type}`)
	}
}

export async function createReport(data: CreateReportData): Promise<{ id: string, name: string, project: { name: string } }> {
	try {
		validateReportData(data)

		const token = localStorage.getItem('auth_token')
		if (!token) {
			throw new Error('Authentication required')
		}

		const response = await fetch('/api/proxy?endpoint=/api/reports', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(data)
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.detail || 'Failed to create report')
		}

		const report = await response.json()
		return report
	} catch (error) {
		console.error('Error creating report:', error)
		throw error
	}
} 