'use client'

// libraries
import clsx from 'clsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// components
import Warning from '@/components/Reports/components/Warning'

// utils
import useWindowSize from '@/utils/useWindowSize'
import { formatPrice } from '@/utils/functions'

// styles
import styles from './index.module.scss'

// interface
export interface PriceDistributionByBrandProps {
    data: Array<{
        brand: string
        price: number
    }>
    reportSummary: {
        retailers?: string[]
        brands?: string[]
        genders?: string[]
        age?: string
        type?: string
        includeImages?: boolean
        timePeriod?: string
        location?: string
        regions?: string
        priceRange?: string
    }
    height?: number
    showAllNumbers?: boolean
}

const CustomValueLabel = (props: any) => {
    const { x, y, width, value } = props
    
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
        return (
            <div className={styles.tooltip}>

                <p className='text-14 medium gray-600 capitalize'>
                    Brand: {payload[0].payload.brand}
                </p>

                <p className='text-14 bold gray-600'>
                    Avg. Price: {formatPrice(payload[0].payload.price)}
                </p>

            </div>
        )
    }
    
    return null
}

export default function PriceDistributionByBrand({
    data,
    reportSummary,
    height,
    showAllNumbers
}: PriceDistributionByBrandProps) {
    //console.log('DEBUGGING RAW DATA:')
    //console.log('Original reportSummary:', reportSummary)
    
    // Handle the case where brands is an array containing comma-separated strings
    let brandsList: string[] = []
    
    if (reportSummary.brands) {
        if (Array.isArray(reportSummary.brands)) {
            // Process each item in the array, handling comma-separated values
            for (const item of reportSummary.brands) {
                if (typeof item === 'string' && item.includes(',')) {
                    // This array element itself contains comma-separated values
                    const splitItems = item.split(',').map(b => b.trim()).filter(Boolean)
                    brandsList.push(...splitItems)
                } else {
                    // Regular array element
                    brandsList.push(item)
                }
            }
        } else if (typeof reportSummary.brands === 'string') {
            // Direct string splitting
            brandsList = (reportSummary.brands as string)
                .split(',')
                .map(b => b.trim())
                .filter(Boolean)
        }
    }
    
    //console.log('Processed brandsList:', brandsList)
    
    // Create processed data - start with existing data
    let processedData: Array<{brand: string, price: number | null}> = [...data.map(item => ({
        brand: item.brand,
        price: item.price
    }))]
    
    // Add missing brands
    for (const brand of brandsList) {
        // Case-insensitive match
        const exists = processedData.some(
            item => item.brand.toLowerCase() === brand.toLowerCase()
        )
        
        if (!exists) {
            processedData.push({
                brand: brand,
                price: null
            })
        }
    }
    
    //console.log('Final processedData:', processedData)
    
    // Check if any brands are missing data
    const hasMissingData = processedData.some(item => item.price === null)

    // the functions below changes the size of the font and the bars according to the window size
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 8 : 12

    return (
        <div className={styles.component}>
            {hasMissingData && (
                <Warning text="Some brands you've selected do not have enough data to completely generate this chart. For a more accurate chart, please change the queries when creating the report." />
            )}

            <ResponsiveContainer height={height || 400} className={styles.chart}>
                <BarChart 
                    data={processedData}
                    margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
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
                        dataKey='brand' 
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
                        domain={[0, 'dataMax']}
                        tickFormatter={(value) => {
                            return `$${value.toFixed(2)}`
                        }}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='price'
                        radius={[20, 20, 0, 0]}
                        barSize={20}
                        spacing={20}
                        fill='url(#verticalBarsGradient)'
                    >

                        {showAllNumbers && (
                            <LabelList
                                dataKey='price'
                                content={CustomValueLabel}
                            />
                        )}
                    </Bar>
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}