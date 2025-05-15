// Define ChartResultItem interface
export interface ChartResultItem {
    [key: string]: any
}

// Format chart data based on chart type
export function formatChartData(chart: any) {
    let chartData = {}
    const chartType = chart.preferences?.chart_type || 'vertical'
    
    // format results based on chart type
    switch(chartType) {
        // price point analysis
        case 'price_point_analysis':
            chartData = {
                pricePointAnalysis: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => {
                            // handle both _id and id fields
                            const pricePoint = item._id !== undefined ? item._id : item.id
                            
                            // convert price point to range
                            let rangeLabel

                            if (pricePoint === 'other') {
                                rangeLabel = '$145 - $150'
                            } else {
                                const numericPoint = Number(pricePoint)
                            
                                // create a range label: current point to next point
                                const increment = 5
                                const nextPoint = numericPoint + increment
                                rangeLabel = `$${numericPoint}-$${nextPoint}`
                            }
                            
                            return {
                                id: rangeLabel,
                                count: typeof item.count === 'number' ? item.count : 0
                            }
                        }).sort((a: {id: string, count: number}, b: {id: string, count: number}) => {
                        
                            // special handling for '$145 - $150' category (always at the end)
                            if (a.id === '$145 - $150') return 1
                            if (b.id === '$145 - $150') return -1
                        
                            // extract the starting price from the range
                            const getStartPrice = (range: string) => {
                                const match = range.match(/\$(\d+)-/)
                                return match ? parseInt(match[1]) : 0
                            }
                        
                            // sort by starting price
                            return getStartPrice(a.id) - getStartPrice(b.id)
                        }) : []
            }
            break
            
        // price point by retailer
        case 'price_point_by_retailer':
            chartData = {
                pricePointByRetailer: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        company: item.company || item.retailer || 'Unknown',
                        min: typeof item.min === 'number' ? item.min : 0,
                        avg: typeof item.avg === 'number' ? item.avg : 0,
                        max: typeof item.max === 'number' ? item.max : 0
                    })) : []
            }
            break

        // price distribution by brand
        case 'price_distribution_by_brand' :
            chartData = {
                priceDistributionByBrand: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        brand: item.brand || 'Unknown',
                        price: typeof item.price === 'number' ? item.price : 0
                    })) : []
            }
            break

        // sku analysis
        case 'sku_analysis':
            chartData = {
                skuAnalysis: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        company: item.company || 'Unknown',
                        count: typeof item.count === 'number' ? item.count : 0
                    })) : []
            }
            break

        // color analysis
        case 'colors':
            chartData = {
                colors: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        color: item.color || 'Unknown',
                        count: typeof item.count === 'number' ? item.count : 0
                    })) : []
            }
            break
            
        case 'vertical':
            chartData = {
                vertical: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        label: item.product_name || 'Unknown',
                        value: typeof item.price === 'number' ? item.price : 0
                    })) : []
            }
            break
            
        case 'horizontal':
            chartData = {
                horizontal: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        name: item.product_name || 'Unknown',
                        value: typeof item.price === 'number' ? item.price : 0
                    })) : []
            }
            break
            
        default:
            // Default to vertical chart if type is unknown
            chartData = {
                vertical: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        label: item.product_name || 'Unknown',
                        value: typeof item.price === 'number' ? item.price : 0
                    })) : []
            }
            break
    }
    
    return { chartData, chartType }
}

// Generate chart summary data from report
export function getChartSummary(report: any, formatDateForReport: (date: string) => string) {
    return {
        retailers: Array.isArray(report.product_settings?.retailers) ? report.product_settings.retailers : [],
        brands: Array.isArray(report.product_settings?.brands) ? report.product_settings.brands : [],
        genders: Array.isArray(report.product_settings?.genders) ? report.product_settings.genders : [],
        age: report.product_settings?.age,
        type: Array.isArray(report.product_settings?.type_store) && report.product_settings.type_store.length > 0 
            ? report.product_settings.type_store[0] 
            : undefined,
        includeImages: report.product_settings?.include_images,
        timePeriod: `${formatDateForReport(report.product_settings?.start_date)} - ${formatDateForReport(report.product_settings?.end_date)}`,
        location: report.product_settings?.location,
        regions: Array.isArray(report.product_settings?.regions) ? report.product_settings.regions : [],
        priceRange: (report.product_settings?.min_price && report.product_settings?.max_price) 
            ? `$${report.product_settings.min_price} - $${report.product_settings.max_price}` 
            : undefined
    }
} 