export function phone(str) {
	return (
		'tel:' + str.replace(/[^0-9]/g, '')
	)
}

export function email(str) {
	return (
		'mailto:' + str
	)
}

// get vw / vh
export const vw = (coef) => window.innerWidth * (coef/100)
export const vh = (coef) => window.innerHeight * (coef/100)

// limit characters
export function limitCharacters(text, limit) {
    if (text.length <= limit) {
        return text
    } else {
        return text.slice(0, limit) + '...'
    }
}

// slugify
export function slugify(str) {
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