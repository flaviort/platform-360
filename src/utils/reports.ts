export interface CreateReportData {
	name: string
	product_type: 'shop360' | 'demand360' | 'insight360' | 'feedback360'
	category_id: string
	status: boolean
	goal: string
	project_id: string

	product_settings: {

		// shop360 specific fields
		retailers?: string[]
		brands?: string[]
		genders?: string[]
		type_store?: string[]
		include_images?: boolean
		start_date: Date | string
		end_date: Date | string

		// demand360 specific fields
		location?: string
		regions?: string[]

		// feedback360 specific fields
		audience_size?: number
		age?: number
		questions?: string[]
		min_price?: number
		max_price?: number
	}
}

interface ProjectAndCategoryIds {
	projectId: string
	categoryId: string
}

export async function getProjectAndCategoryIds(data: { selectedProject: string, newProjectName?: string, projectGoal?: string, category: string }): Promise<ProjectAndCategoryIds> {
	
	const token = localStorage.getItem('auth_token')
	
	if (!token) {
		throw new Error('Authentication required')
	}

	let projectId = ''
	let projectName = data.selectedProject

	// if creating a new project, create it first
	if (data.selectedProject === 'New Project') {
		const requestBody = {
			name: data.newProjectName,
			project_goal: data.projectGoal
		};
		console.log('Creating new project with data:', requestBody);

		const newProjectResponse = await fetch('/api/proxy?endpoint=/api/projects', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(requestBody)
		})

		if (!newProjectResponse.ok) {
			// Get error details
			let errorDetails = 'Unknown error'
			try {
				const errorResponse = await newProjectResponse.json()
				errorDetails = JSON.stringify(errorResponse, null, 2)
			} catch (e) {
				errorDetails = await newProjectResponse.text()
			}
			
			console.error(`API Error (${newProjectResponse.status}): ${errorDetails}`)
			throw new Error('Failed to create new project')
		}

		const newProject = await newProjectResponse.json()
		console.log('New project created with response:', newProject)

		projectId = newProject.id
		projectName = newProject.name
	} else {

		// get project ID from the selected project
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

	// get category ID from the selected category
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
	
	// validate required fields
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

	// validate product-specific fields
	switch (data.product_type) {
		case 'shop360':
			if (!data.product_settings.retailers?.length) { throw new Error('At least one retailer must be selected') }
			if (!data.product_settings.brands?.length) { throw new Error('At least one brand must be selected') }
			if (!data.product_settings.genders?.length) { throw new Error('At least one gender must be selected') }
			if (!data.product_settings.type_store) { throw new Error('Type of store must be selected') }
			if (!data.product_settings.start_date) { throw new Error('Start date must be selected') }
			if (!data.product_settings.end_date) { throw new Error('End date must be selected') }
			break
		case 'demand360':
			if (!data.product_settings.start_date) { throw new Error('Start date must be selected') }
			if (!data.product_settings.end_date) { throw new Error('End date must be selected') }
			if (!data.product_settings.location) { throw new Error('Location must be selected') }
			if (!data.product_settings.regions?.length) { throw new Error('At least one region must be selected') }
			break
		case 'insight360':
			if (!data.product_settings.brands?.length) { throw new Error('At least one brand must be selected') }
			if (!data.product_settings.genders?.length) { throw new Error('At least one gender must be selected') }
			break
		case 'feedback360':
			if (!data.product_settings.audience_size) { throw new Error('Audience size is required') }
			if (!data.product_settings.genders?.length) { throw new Error('At least one gender must be selected') }
			if (!data.product_settings.age) { throw new Error('Age is required') }
			if (!data.product_settings.location) { throw new Error('Location must be selected') }
			if (!data.product_settings.regions?.length) { throw new Error('At least one region must be selected') }
			if (!data.product_settings.retailers?.length) { throw new Error('At least one retailer must be selected') }
			if (!data.product_settings.questions?.length) { throw new Error('At least one question is required') }
			if (!data.product_settings.min_price) { throw new Error('Minimum price is required') }
			if (!data.product_settings.max_price) { throw new Error('Maximum price is required') }
			break
		default:
			throw new Error(`Unknown product type: ${data.product_type}`)
	}
}

export const createReport = async (data: CreateReportData): Promise<any> => {
    try {
        console.log('Creating report with data:', data)
        
        // Format dates correctly if they are Date objects
        if (data.product_settings) {
            if (data.product_settings.start_date instanceof Date) {
                data.product_settings.start_date = data.product_settings.start_date.toISOString().split('T')[0]
            }
            
            if (data.product_settings.end_date instanceof Date) {
                data.product_settings.end_date = data.product_settings.end_date.toISOString().split('T')[0]
            }
        }
        
        console.log('Sending formatted data to API:', JSON.stringify(data, null, 2))
        
        const response = await fetch('/api/proxy?endpoint=/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(data)
        })
        
        if (!response.ok) {
            // Get the error details from the response
            let errorDetails = 'Unknown error'
            try {
                const errorResponse = await response.json()
                errorDetails = JSON.stringify(errorResponse, null, 2)
            } catch (e) {
                errorDetails = await response.text()
            }
            
            console.error(`API Error (${response.status}): ${errorDetails}`)
            throw new Error('Failed to create report')
        }
        
        const responseData = await response.json()
        return responseData
    } catch (error) {
        console.error('Error creating report:', error)
        throw error
    }
} 