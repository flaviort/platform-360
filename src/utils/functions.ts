// phone
export function phone(str: string) {
	return (
		'tel:' + str.replace(/[^0-9]/g, '')
	)
}

// email
export function email(str: string) {
	return (
		'mailto:' + str
	)
}

// get vw / vh
export const vw = (coef: number) => window.innerWidth * (coef/100)
export const vh = (coef: number) => window.innerHeight * (coef/100)

// limit characters
export function limitCharacters(text: string, limit: number) {
    if (text.length <= limit) {
        return text
    } else {
        return text.slice(0, limit) + '...'
    }
}

// slugify
export function slugify(str: string) {
    return String(str)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

// placeholder
export const placeholder = (theme = 'dark') => {
    const colors = theme === 'light' 
        ? { start: '#fff', middle: '#eee', end: '#fff' } 
        : { start: '#333', middle: '#222', end: '#333' }

    const shimmer = `
        <svg width='1' height='1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
            <defs>
                <linearGradient id='g'>
                    <stop stop-color='${colors.start}' offset='20%' />
                    <stop stop-color='${colors.middle}' offset='50%' />
                    <stop stop-color='${colors.end}' offset='70%' />
                </linearGradient>
            </defs>
            <rect width='1' height='1' fill='${colors.start}' />
            <rect id='r' width='1' height='1' fill='url(#g)' />
            <animate xlink:href='#r' attributeName='x' from='-1' to='1' dur='1s' repeatCount='indefinite'  />
        </svg>
    `

    return typeof window === 'undefined' ? Buffer.from(shimmer).toString('base64') : window.btoa(shimmer)
}

// first char
export function firstChar(str: string) {
    return str.charAt(0) || ''
}

// get all project names
export function getProjects(projects: any[]) {
    return Array.from(new Set(projects.map((project: any) => project.project)))
}

// format date
export function formatDate(dateString: string) {
    const date = new Date(dateString)
    
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    
    return `${day}.${month}.${year} at ${hours}:${minutes}`
}