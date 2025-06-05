// Define ChartResultItem interface
export interface ChartResultItem {
    [key: string]: any
}

// Import the formatPrice utility
import { formatPrice } from '@/utils/functions'

// Format chart data based on chart type
export function formatChartData(chart: any) {
    let chartData = {}
    const chartType = chart.preferences?.chart_type || 'vertical'
    const svgMap = chart.preferences?.svg_map || 'us'
    
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

        // geography trend
        case 'geography_trend' :
            chartData = {
                geographyTrend: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        geo: item.geo || 'Unknown',
                        name: item.name || 'Unknown',
                        values: Array.isArray(item.values) ? item.values : [
                            {
                                query: item.query || 'Unknown',
                                value: typeof item.value === 'number' ? item.value : 0
                            }
                        ]
                    })) : []
            }
            break

        // category trend
        case 'category_trend':
            chartData = {
                categoryTrend: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        date: item.date || 'Unknown',
                        values: Array.isArray(item.values) ? item.values : [{
                            query: item.query || 'Unknown',
                            value: typeof item.value === 'number' ? item.value : 0
                        }]
                    })) : []
            }
            break

        // pro features
        case 'pro_features' :
            chartData = {
                prosAndCons: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => ({
                        title: item.title || 'Unknown',
                        executive_summary: item.executive_summary || 'Unknown',
                        features: Array.isArray(item.features) ? item.features : [{
                            name: item.name || 'Unknown',
                            description: item.description || 'Unknown'
                        }]
                    })) : []
            }
            break
            
        case 'vertical':
            chartData = {
                vertical: Array.isArray(chart.results) ? 
                    chart.results.map((item: ChartResultItem) => {
                        // detect which fields to use as label
                        const labelKey = item.brand ? 'brand' : 
                                        item.company ? 'company' : 
                                        item.product_name ? 'product_name' : 
                                        Object.keys(item).find(key => key !== 'price' && key !== 'value') || '';
                        
                        // determine label type based on the field
                        const labelType = labelKey === 'brand' ? 'Brand' :
                                        labelKey === 'company' ? 'Retailer' :
                                        labelKey === 'product_name' ? 'Product' :
                                        'Item';
                        
                        // get and capitalize the label (brand/company name)
                        let labelValue = String(item[labelKey] || 'Unknown');
                        
                        // capitalize each word in the label
                        const label = labelValue
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' ');
                        
                        // get the value - prefer price if available
                        let value = 0;
                        if (typeof item.price === 'number') {

                            // handle large integer prices (if stored in cents)
                            if (item.price > 1000 && Number.isInteger(item.price)) {
                                value = item.price / 100;
                            } else {
                                value = item.price;
                            }

                            // round price values to exactly 2 decimal places
                            value = Math.round(value * 100) / 100;
                        } else if (typeof item.value === 'number') {
                            value = item.value;
                        }
                        
                        // format display value for prices
                        let displayValue;

                        if (item.price !== undefined) {
                            displayValue = formatPrice(value);
                        }
                        
                        return {
                            label,
                            labelTitle: item.price !== undefined ? 'Price' : 'Value',
                            value,
                            labelType,
                            ...(displayValue ? { displayValue } : {})
                        };
                    }) : []
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
            // default to vertical chart if type is unknown
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

// generate chart summary data from report
export function getChartSummary(report: any, formatDateForReport: (date: string) => string) {
    return {
        retailers: Array.isArray(report.product_settings?.retailers) ? report.product_settings.retailers : [],
        brands: Array.isArray(report.product_settings?.brands) ? report.product_settings.brands : [],
        genders: Array.isArray(report.product_settings?.genders) ? report.product_settings.genders : [],
        age: report.product_settings?.age,
        //type: Array.isArray(report.product_settings?.type_store) && report.product_settings.type_store.length > 0 ? report.product_settings.type_store[0] : undefined,
        //includeImages: report.product_settings?.include_images,
        timePeriod: `${formatDateForReport(report.product_settings?.start_date)} - ${formatDateForReport(report.product_settings?.end_date)}`,
        location: report.product_settings?.location,
        regions: Array.isArray(report.product_settings?.regions) ? report.product_settings.regions : [],
        priceRange: (report.product_settings?.min_price && report.product_settings?.max_price) 
            ? `$${report.product_settings.min_price} - $${report.product_settings.max_price}` 
            : undefined
    }
}

/**
 * Converts location codes to their full display names
 */
export const convertLocationCode = (locationCode: string): string => {
    switch(locationCode) {
        case 'US':
            return 'United States'
        case 'CA':
            return 'Canada'
        case 'EU':
            return 'Europe'
        default:
            return locationCode
    }
}

/**
 * Formats raw data from API into a standardized format for vertical bar charts
 * Flexibly handles different data formats (company/brand/etc. as labels, price/value as values)
 */
export const formatFlexibleChartData = (rawData: any[] = []) => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
        return []
    }
    
    return rawData.map(item => {
        // Detect which fields to use as label and value
        const labelKey = item.brand ? 'brand' : 
                         item.company ? 'company' : 
                         item.product_name ? 'product_name' : 
                         Object.keys(item).find(key => key !== 'price' && key !== 'value') || ''
        
        // Detect value field (price or value)
        const valueKey = item.price !== undefined ? 'price' : 'value'
        
        // Get the raw numeric value
        let numericValue = 0

        if (item[valueKey] !== undefined) {
            // Convert to number type
            numericValue = Number(item[valueKey])
            
            // Handle large integer prices (if stored in cents)
            if (valueKey === 'price' && numericValue > 1000 && Number.isInteger(numericValue)) {
                numericValue = numericValue / 100
            }
            
            // Round price values to exactly 2 decimal places
            if (valueKey === 'price') {
                numericValue = Math.round(numericValue * 100) / 100
            }
        }
        
        // Format the display value for price fields
        let formattedValue = undefined

        if (valueKey === 'price') {
            // Format as currency with $ and commas using formatPrice utility
            formattedValue = formatPrice(numericValue)
        }
        
        // Get and capitalize the label (brand/company name)
        let labelValue = String(item[labelKey] || '')
        
        // Capitalize each word in the label
        const capitalizedLabel = labelValue
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            
        // Create the chart item with the optional displayValue
        return {
            label: capitalizedLabel,
            labelTitle: valueKey === 'price' ? 'Price' : 'Value',
            value: numericValue,
            ...(formattedValue ? { displayValue: formattedValue } : {})
        }
    })
} 