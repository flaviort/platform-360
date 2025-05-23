'use client'

// libraries
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

// utils
import useWindowSize from '@/utils/useWindowSize'
import { formatPrice } from '@/utils/functions'

// styles
import styles from './index.module.scss'

// interface
export interface VerticalBarsProps {
    data: Array<{
        label?: string
        labelTitle?: string
        value?: number
        displayValue?: string
        
        // add generic fields to support raw API data
        brand?: string
        company?: string
        product_name?: string
        price?: number
        [key: string]: any
    }>
    height?: number
    showAllNumbers?: boolean
}

const CustomValueLabel = (props: any) => {
    const { x, y, width, value } = props
    
    // Skip rendering if value is null or undefined
    if (value === null || value === undefined) return null
    
    // Calculate position for rotated text
    const positionX = x + (width / 2)
    const rotationY = y - 7
    
    return (
        <text
            x={positionX}
            y={rotationY}
            fill='#333'
            textAnchor='middle'
            className='text-14 medium'
        >
            {formatPrice(value)}
        </text>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        // Get display value - use displayValue if available, otherwise format the value
        let displayValue = payload[0].payload.displayValue
        
        // If no displayValue but the labelTitle is "Price", format as currency
        if (!displayValue && payload[0].payload.labelTitle === 'Price') {
            const value = payload[0].payload.value
            displayValue = formatPrice(value)
        } else if (!displayValue) {
            // For non-price values, just use the raw value
            displayValue = payload[0].payload.value
        }
        
        // Get the label type (Brand, Retailer, etc)
        const labelType = payload[0].payload.labelType || 'Item'
        
        return (
            <div className={styles.tooltip}>
                <p className='text-14 medium gray-600'>
                    {labelType}: {payload[0].payload.label}
                </p>

                <p className='text-14 bold gray-600'>
                    {payload[0].payload.labelTitle && (
                        payload[0].payload.labelTitle + ': '
                    )}
                    {displayValue}
                </p>
            </div>
        )
    }
    
    return null
}

// Helper function to process incoming data into a consistent format
const processData = (rawData: any[]) => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
        return []
    }

    return rawData.map(item => {
        // Skip processing if item already has the expected format
        if (item.label !== undefined && item.value !== undefined) {
            // If the item is already formatted but doesn't have labelType, try to infer it
            const labelType = item.labelType || 'Item'
            
            return {
                ...item,
                // Ensure values are numeric and labels are strings
                label: String(item.label || ''),
                value: Number(item.value),
                labelType
            }
        }

        // Otherwise apply flexible data handling

        // Detect which fields to use as label and value
        const labelKey = item.brand ? 'brand' : 
                         item.company ? 'company' : 
                         item.product_name ? 'product_name' : 
                         Object.keys(item).find(key => key !== 'price' && key !== 'value') || ''
        
        // Determine label type based on the field
        const labelType = labelKey === 'brand' ? 'Brand' :
                         labelKey === 'company' ? 'Retailer' :
                         labelKey === 'product_name' ? 'Product' :
                         'Item'
        
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
            // Format as currency with $ and commas using the formatPrice utility
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
            labelType,
            ...(formattedValue ? { displayValue: formattedValue } : {})
        }
    })
}

export default function VerticalBars({
    data,
    height,
    showAllNumbers
}: VerticalBarsProps) {
    // Process the input data into a consistent format
    const processedData = processData(data)

    // the functions below changes the size of the font and the bars according to the window size
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 8 : 12
        
    // Determine if the data represents prices (check if any item has a price-formatted displayValue)
    const isPriceData = processedData.some(item => 
        item.displayValue && item.displayValue.includes('$')
    )
    
    // Format function for YAxis ticks
    const formatYAxisTick = (value: number) => {
        if (isPriceData) {
            if (value >= 1000) {
                return `$${(value / 1000).toFixed(1)}k`
            }
            // Format price using the formatPrice utility
            return formatPrice(value)
        }
        return value.toString()
    }

    // Calculate a better domain max based on actual data
    const calculateYAxisMax = () => {
        // Find the actual max value in the data
        const maxValue = Math.max(...processedData
            .filter(item => item.value !== null && item.value !== undefined)
            .map(item => Number(item.value)))
        
        // For price data, use specific dollar rounding rules
        if (isPriceData) {
            if (maxValue < 100) {
                // For values below $100, round up to the nearest $10
                return Math.ceil(maxValue / 10) * 10
            }
            if (maxValue <= 500) {
                // For values between $100-$500, round up to the nearest $50
                return Math.ceil(maxValue / 50) * 50
            }
            // For values over $500, round up to the nearest $100
            return Math.ceil(maxValue / 100) * 100
        }
        
        // For non-price data (original logic)
        if (maxValue <= 1) return 1
        if (maxValue <= 5) return 5
        if (maxValue <= 10) return 10
        if (maxValue <= 20) return 20
        if (maxValue <= 50) return 50
        if (maxValue <= 100) return 100
        
        if (maxValue < 1000) {
            return Math.ceil(maxValue / 50) * 50
        }
        
        return Math.ceil(maxValue / 100) * 100
    }
    
    const yAxisMax = calculateYAxisMax()
    
    // Generate appropriate tick values
    const generateTicks = (max: number) => {
        const numTicks = 5 // Number of ticks to generate
        const step = max / (numTicks - 1)
        return Array.from({length: numTicks}, (_, i) => Math.round(i * step))
    }
    
    const yAxisTicks = generateTicks(yAxisMax)

    return (
        <div className={styles.component}>
            <ResponsiveContainer height={height || 400} className={styles.chart}>
                <BarChart 
                    data={processedData}
                    margin={{ bottom: 0, left: 10, right: 0, top: 0 }}
                >
                    <defs>
                        <linearGradient id='verticalBarsGradient' x1='0' y1='1' x2='0' y2='0'>
                            <stop offset='0%' stopColor='#48238F' />
                            <stop offset='100%' stopColor='#3691E1' />
                        </linearGradient>
                    </defs>

                    <CartesianGrid 
                        strokeDasharray='3 3' 
                        vertical={false}
                    />

                    <XAxis 
                        dataKey='label' 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                        className='text-12 capitalize'
                        textAnchor='middle'
                    />

                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                        width={45}
                        domain={[0, yAxisMax]}
                        ticks={yAxisTicks}
                        tickFormatter={formatYAxisTick}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='value'
                        radius={[30, 30, 0, 0]}
                        barSize={20}
                        spacing={20}
                        fill='url(#verticalBarsGradient)'
                    >
                        {showAllNumbers && (
                            <LabelList
                                dataKey='value'
                                content={CustomValueLabel}
                            />
                        )}
                    </Bar>
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}