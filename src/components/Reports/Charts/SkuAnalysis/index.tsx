'use client'

// libraries
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// components
import Warning from '@/components/Reports/components/Warning'

// css
import styles from './index.module.scss'

// interface
export interface HorizontalBarsProps {
    data: Array<{
        company: string
        count: number
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
}

const CustomLabel = (props: any) => {
    const { x, y, width, value, height, payload } = props

    // safe access to company name, fallback to the value prop if payload is undefined
    const companyName = payload && payload.company ? payload.company : value

    return (
        <foreignObject
            x={0}
            y={y}
            width='70'
            height={height}
            alignmentBaseline='middle'
        >
            <div className={styles.companyLabel}>
                <p className='text-12 medium gray-600'>
                    {companyName}
                </p>
            </div>
        </foreignObject>
    )
}

const CustomValueLabel = (props: any) => {
    const { x, y, width, value, height } = props
    
    // Safely handle potential NaN values
    const xPosition = (x !== undefined && !isNaN(x) ? x : 0) + 
                      (width !== undefined && !isNaN(width) ? width : 0) + 10
    
    const yPosition = y + height / 2
    
    // Format number with US locale (adds commas as thousand separators)
    const formattedValue = typeof value === 'number' 
        ? value.toLocaleString('en-US')
        : value
    
    return (
        <text
            x={xPosition.toString()} // Convert to string to avoid React warning
            y={yPosition}
            fill='#333'
            alignmentBaseline='middle'
            className='text-14 medium'
        >
            {formattedValue}
        </text>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.tooltip}>

                <p className='text-14 medium'>
                    Retailer: {payload[0].payload.company}
                </p>

                <p className='text-14 bold'>
                    SKUs: {payload[0].payload.count.toLocaleString('en-US')}
                </p>

            </div>
        )
    }
    
    return null
}

export default function HorizontalBars({
    data,
    reportSummary
}: HorizontalBarsProps) {
    //console.log('DEBUGGING RAW DATA:')
    //console.log('Original reportSummary:', reportSummary)
    
    // Handle the case where retailers is an array containing comma-separated strings
    let retailersList: string[] = []
    
    if (reportSummary.retailers) {
        if (Array.isArray(reportSummary.retailers)) {
            // Process each item in the array, handling comma-separated values
            for (const item of reportSummary.retailers) {
                if (typeof item === 'string' && item.includes(',')) {
                    // This array element itself contains comma-separated values
                    const splitItems = item.split(',').map(r => r.trim()).filter(Boolean)
                    retailersList.push(...splitItems)
                } else {
                    // Regular array element
                    retailersList.push(item)
                }
            }
        } else if (typeof reportSummary.retailers === 'string') {
            // Direct string splitting
            retailersList = (reportSummary.retailers as string)
                .split(',')
                .map(r => r.trim())
                .filter(Boolean)
        }
    }
    
    //console.log('Processed retailersList:', retailersList)
    
    // Create processed data - start with existing data
    let processedData: Array<{company: string, count: number | null}> = [...data.map(item => ({
        company: item.company,
        count: item.count
    }))]
    
    // Add missing retailers
    for (const retailer of retailersList) {
        // Case-insensitive match
        const exists = processedData.some(
            item => item.company.toLowerCase() === retailer.toLowerCase()
        )
        
        if (!exists) {
            processedData.push({
                company: retailer,
                count: null
            })
        }
    }
    
    //console.log('Final processedData:', processedData)
    
    // Check if any retailers are missing data
    const hasMissingData = processedData.some(item => item.count === null)

    return (
        <div className={styles.component}>

            {hasMissingData && (
                <Warning text="Some retailers you've selected do not have enough data to completely generate this chart. For a more accurate chart, please change the queries when creating the report." />
            )}

            <div className={styles.header}>
                
                <h4 className='text-14 gray-600'>
                    List of Retailers
                </h4>

                <span className='text-14 gray-600'>
                    {processedData.length} retailers
                </span>

            </div>

            <ResponsiveContainer height={processedData.length * 50} className={styles.chart}>
                <BarChart
                    data={processedData}
                    layout='vertical'
                    margin={{
                        left: 90,
                        bottom: -30,
                        right: 20,
                        top: 0
                    }}
                >
                    <defs>
                        <linearGradient id='horizontalBarsGradient' x1='0' y1='0' x2='1' y2='0'>
                            <stop offset='0%' stopColor='#48238F' />
                            <stop offset='100%' stopColor='#3691E1' />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray='3 3' horizontal={false} />

                    <XAxis
                        type='number'
                        dataKey='count'
                        tickFormatter={(value) => value.toLocaleString('en-US')}
                        tick={{
                            fill: '#666',
                            fontSize: 10
                        }}
                        //axisLine={false}
                        //tickLine={false}
                        tickMargin={10}
                    />

                    <YAxis
                        hide
                        type='category'
                        dataKey='company'
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='count'
                        radius={[0, 20, 20, 0]}
                        barSize={22}
                        fill='url(#horizontalBarsGradient)'
                    >
                        
                        <LabelList
                            dataKey='company'
                            content={CustomLabel}
                            position='left'
                        />

                        <LabelList
                            dataKey='count'
                            content={CustomValueLabel}
                        />

                    </Bar>

                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}