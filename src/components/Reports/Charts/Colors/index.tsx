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
}

// process and filter data to remove empty/null colors
const processData = (data: ColorsProps['data']) => {
    
    // make sure we filter out any items with empty, null, whitespace-only, or "Unknown" colors
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
                </p>

            </div>
        )
    }
    
    return null
}

export default function Colors({
    data
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
    
    // the functions below changes the size of the font and the bars according to the window size
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 10 : 12
    const barSize = filteredData.length > 10 ? (windowSize.width < 575 ? 10 : windowSize.width < 992 ? 15 : 22) : 15

    return (
        <div className={styles.component}>
            <ResponsiveContainer height={400} className={styles.chart}>
                <BarChart 
                    data={filteredData}
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
                        spacing={20}
                    >
                        {filteredData.map((entry, index) => (
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
                    </Bar>
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}