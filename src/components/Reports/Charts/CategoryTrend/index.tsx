'use client'

// libraries
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

// utils
import useWindowSize from '@/utils/useWindowSize'

// styles
import styles from './index.module.scss'

// interface
export interface CategoryTrendProps {
    data: Array<{
        date: string
        values: Array<{
            [key: string]: any
        }>
    }>
    height?: number
    showAllNumbers?: boolean
    showAsYear?: boolean
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
            {value}
        </text>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].payload.value
        const categoryName = payload[0].payload.categoryName || 'Value'
        
        return (
            <div className={styles.tooltip}>
                <p className='text-14 medium gray-600'>
                    Date: {payload[0].payload.date}
                </p>

                <p className='text-14 bold gray-600'>
                    {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}: {value}
                </p>
            </div>
        )
    }
    
    return null
}

// Helper function to process incoming data into a consistent format
const processData = (rawData: any[], showAsYear: boolean = false) => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
        return []
    }

    // If showAsYear is true, group by year and calculate averages
    if (showAsYear) {
        // Group data by year
        const yearGroups: { [year: string]: number[] } = {}
        let categoryName = ''

        rawData.forEach(item => {
            const date = item.date || ''
            const year = date.split('-')[0]
            
            // Extract value from the values array
            if (item.values && Array.isArray(item.values) && item.values.length > 0) {
                const firstValue = item.values[0]
                if (typeof firstValue === 'object') {
                    const keys = Object.keys(firstValue)
                    if (keys.length > 0) {
                        if (!categoryName) categoryName = keys[0] // Set category name from first item
                        const value = Math.round(Number(firstValue[keys[0]])) || 0
                        
                        if (!yearGroups[year]) {
                            yearGroups[year] = []
                        }
                        yearGroups[year].push(value)
                    }
                }
            }
        })

        // Calculate averages and create chart data
        return Object.keys(yearGroups)
            .sort()
            .map(year => {
                const values = yearGroups[year]
                const average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
                
                return {
                    label: year,
                    labelTitle: categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 'Value',
                    date: year,
                    value: average,
                    labelType: 'Year',
                    categoryName: categoryName
                }
            })
    }

    // Original monthly logic when showAsYear is false
    return rawData.map(item => {
        // Extract date and format it for display
        const date = item.date || ''
        
        // Format date for display (e.g., "2020-01" -> "Jan 2020")
        const formatDate = (dateStr: string) => {
            if (!dateStr || !dateStr.includes('-')) return dateStr
            
            const [year, month] = dateStr.split('-')
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            const monthIndex = parseInt(month) - 1
            
            if (monthIndex >= 0 && monthIndex < 12) {
                return `${monthNames[monthIndex]} ${year}`
            }
            return dateStr
        }
        
        // extract value from the values array
        // assuming there's only one category per item, get the first value
        let value = 0
        let categoryName = ''
        
        if (item.values && Array.isArray(item.values) && item.values.length > 0) {
            const firstValue = item.values[0]
            if (typeof firstValue === 'object') {
                
                // get the first key-value pair
                const keys = Object.keys(firstValue)
                if (keys.length > 0) {
                    categoryName = keys[0]
                    value = Math.round(Number(firstValue[keys[0]])) || 0
                }
            }
        }
        
        return {
            label: formatDate(date),
            labelTitle: categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 'Value',
            date: date,
            value: value,
            labelType: 'Date',
            categoryName: categoryName
        }
    })
}

export default function CategoryTrend({
    data,
    height,
    showAllNumbers,
    showAsYear = false
}: CategoryTrendProps) {
    
    // process the input data into a consistent format
    const processedData = processData(data, showAsYear)

    // the functions below changes the size of the font and the bars according to the window size
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 8 : 12
    
    // Format function for YAxis ticks
    const formatYAxisTick = (value: number) => {
        return value.toString()
    }

    // Since values are always 0-100, set fixed max
    const yAxisMax = 100
    
    // Generate ticks for 0-100 range
    const yAxisTicks = [0, 25, 50, 75, 100]

    const dataLength = processedData.length

    const barSize = dataLength > 10 ? 20 : 50

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
                        barSize={barSize}
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