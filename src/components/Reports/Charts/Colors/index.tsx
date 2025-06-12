'use client'

// libraries
import clsx from 'clsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// utils
import useWindowSize from '@/utils/useWindowSize'

// styles
import styles from './index.module.scss'

// interface
export interface ColorsProps {
    data: Array<{
        color: string | null
        count: number
    }>
    height?: number
    showAllNumbers?: boolean
    showAsPercentage?: boolean
}

// process and filter data to remove empty/null colors
const processData = (data: ColorsProps['data']) => {
    
    // make sure we filter out any items with empty, null, whitespace-only, or 'Unknown' colors
    return data.filter(item => {
        if (item.color === null || item.color === undefined) return false
        if (item.color === '') return false
        if (item.color.trim() === '') return false
        if (item.color.toLowerCase() === 'unknown') return false
        if (item.color.toLowerCase() === 'multicolor') return false
        if (item.color.toLowerCase() === 'multi') return false
        return true
    })
}

// Map color names to valid CSS colors
const getColorCode = (colorName: string | null): string => {
    if (!colorName) return '#cccccc'
    
    // Map of common color names that might not match CSS color names
    const colorMap: {[key: string]: string} = {
        'navy': '#000080',
        'sand': '#c2b280',
        'gold': '#ffd700',
        'silver': '#c0c0c0',
        'cognac': '#834a24',
        'royal': '#4169e1',
        // Add more mappings as needed
    }
    
    // Check if there's a specific mapping for this color
    if (colorMap[colorName.toLowerCase()]) {
        return colorMap[colorName.toLowerCase()]
    }
    
    // Otherwise return the color name as is (for standard CSS colors)
    return colorName.toLowerCase()
}

const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props

    // don't render labels for empty/null values
    if (
        !value
        || value === ''
        || value === 'Unknown'
        || value === 'multicolor'
        || value === 'multi'
    ) return null

    return (
        <foreignObject
            x={x - 45}
            y={y + height + 1}
            width='50'
            height='30'
            transform={`rotate(-90 ${x + width/2} ${y + height + 10})`}
        >
            <div className={clsx(styles.bottomLabel, 'text-12 gray-600')}>
                {value}
            </div>
        </foreignObject>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        
        // don't show tooltip for empty/null values
        if (!payload[0].payload.color) return null
        
        // Get percentage value if available
        const percentage = payload[0].payload.percentage ? 
            `${payload[0].payload.percentage.toFixed(1)}%` : null
        
        return (
            <div className={styles.tooltip}>

                <div
                    className={styles.color}
                    style={{ backgroundColor: getColorCode(payload[0].payload.color) }}
                />
                
                <p className='text-14 medium gray-600 capitalize'>
                    Color: {payload[0].payload.color}
                </p>

                <p className='text-14 bold gray-600'>
                    How many: {payload[0].payload.count.toLocaleString('en-US')}
                    {percentage && ` (${percentage})`}
                </p>

            </div>
        )
    }
    
    return null
}

const CustomValueLabel = (props: any) => {
    const { x, y, width, value, index, showAsPercentage, data } = props
    
    // Log to see what's available in the props
    //console.log('CustomValueLabel props:', { value, index, data })
    
    // Format the count value with thousands separator
    const countValue = typeof value === 'number' 
        ? value.toLocaleString('en-US')
        : value
    
    // Get percentage directly from the data array using index
    const percentageValue = data && index !== undefined && data[index]?.percentage
        ? `(${data[index].percentage.toFixed(1)}%)`
        : ''
    
    // Calculate position for rotated text
    const rotationX = x + (width / 2 + 4)
    const rotationY = y - 7
    
    return (
        <text
            x={rotationX}
            y={rotationY}
            fill='#333'
            transform={`rotate(-90, ${rotationX}, ${rotationY}) translate(0, -7)`}
            className='text-12 bold'
        >
            {countValue}
            <tspan x={rotationX} dy='14' className='medium'>
                {percentageValue}
            </tspan>
        </text>
    )
}

export default function Colors({
    data,
    height,
    showAllNumbers,
    showAsPercentage = false
}: ColorsProps) {
    
    // filter out null or empty colors
    const filteredData = processData(data)
    
    // Return a message if no valid data is available
    if (filteredData.length === 0) {
        return (
            <div className={styles.component}>
                <div className='flex'>
                    <p className='text-14 gray-600'>
                        No color data available
                    </p>
                </div>
            </div>
        )
    }
    
    // Calculate the total sum for percentage calculations
    const totalCount = filteredData.reduce((sum, item) => sum + item.count, 0)
    
    // Add percentage values to the data with a more accessible property name
    const dataWithPercentages = filteredData.map(item => {
        const itemPercentage = (item.count / totalCount) * 100
        return {
            ...item,
            percentage: itemPercentage
        }
    })
    
    // the functions below changes the size of the font according to the window size and bars according to number of entries
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 10 : 12
    
    // Calculate barSize based on number of entries
    const getBarSize = (entryCount: number, windowWidth: number) => {
        let baseSize
        if (entryCount < 5) baseSize = 35
        else if (entryCount <= 10) baseSize = 30
        else if (entryCount <= 15) baseSize = 25
        else if (entryCount <= 20) baseSize = 20
        else baseSize = 15 // 20+ entries
        
        // Reduce size for smaller screens
        if (windowWidth < 575) {
            baseSize -= 8
        }
        
        return baseSize
    }
    
    const barSize = getBarSize(dataWithPercentages.length, windowSize.width)

    return (
        <div className={styles.component}>
            <ResponsiveContainer height={height || 400} className={styles.chart}>
                <BarChart 
                    data={dataWithPercentages}
                    margin={{ bottom: 70, left: 10, right: 5, top: 0 }}
                >

                    <CartesianGrid 
                        strokeDasharray='3 3' 
                        vertical={false}
                    />

                    <XAxis 
                        dataKey='color' 
                        axisLine={false}
                        tickLine={false}
                        hide
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                    />

                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                        width={45}
                        domain={[0, 'dataMax']}
                        tickFormatter={(value) => {
                            if (showAsPercentage) {
                                const percentage = (value / totalCount) * 100
                                return `${percentage.toFixed(1)}%`
                            }
                            return value.toLocaleString('en-US')
                        }}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='count'
                        radius={[20, 20, 0, 0]}
                        barSize={barSize}
                        spacing={10}
                    >
                        {dataWithPercentages.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getColorCode(entry.color)}
                                stroke='#ddd'
                                strokeWidth={1}
                            />
                        ))}
                        
                        <LabelList 
                            dataKey='color'
                            content={CustomLabel}
                            position='bottom'
                        />

                        {showAllNumbers && (
                            <LabelList
                                dataKey='count'
                                content={(props) => (
                                    <CustomValueLabel 
                                        {...props} 
                                        showAsPercentage={showAsPercentage}
                                        data={dataWithPercentages}
                                    />
                                )}
                            />
                        )}

                    </Bar>
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}