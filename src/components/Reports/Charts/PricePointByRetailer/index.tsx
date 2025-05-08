'use client'

// libraries
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend } from 'recharts'

// components
import Warning from '@/components/Reports/components/Warning'

// utils
import useWindowSize from '@/utils/useWindowSize'
import { formatPrice } from '@/utils/functions'

// css
import styles from './index.module.scss'

// interface
export interface PricePointByRetailerProps {
    data: Array<{
        company: string
        min: number
        avg: number
        max: number
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

interface RetailerData {
    company: string
    min: number | null
    avg: number | null
    max: number | null
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.tooltip}>
                
                <p className='text-14 medium gray-600 capitalize'>
                    Retailer: {label}
                </p>

                {payload.map((entry: any, index: number) => (
                    <p key={`price-${index}`} className='text-14 bold' style={{ color: entry.color }}>
                        {entry.name}: {formatPrice(entry.value)}
                    </p>
                ))}

            </div>
        )
    }
    
    return null
}

export default function PricePointByRetailer({
    data,
    reportSummary
}: PricePointByRetailerProps) {
    const windowSize = useWindowSize()
    const fontSize = windowSize.width < 575 ? 8 : 12
    
    //console.log('DEBUGGING RAW DATA:')
    //console.log('Original reportSummary:', reportSummary)
    //console.log('Type of retailers:', typeof reportSummary.retailers)
    
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
    let processedData: RetailerData[] = [...data.map(item => ({
        company: item.company,
        min: item.min,
        avg: item.avg,
        max: item.max
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
                min: null,
                avg: null,
                max: null
            })
        }
    }
    
    //console.log('Final processedData:', processedData)
    
    const hasMissingData = processedData.some(item => 
        item.min === null || item.avg === null || item.max === null
    )
    
    // adjust bar size based on number of retailers and screen size
    const getBarSize = () => {
        const retailerCount = processedData.length
        if (retailerCount <= 3) return windowSize.width < 575 ? 15 : 25
        if (retailerCount <= 5) return windowSize.width < 575 ? 10 : 20
        return windowSize.width < 575 ? 8 : 15
    }
    
    const barSize = getBarSize()

    return (
        <div className={styles.component}>

            {hasMissingData && (
                <Warning text="Some retailers you've selected do not have enough data to completely generate this chart. For a more accurate chart, please change the queries when creating the report." />
            )}

            <ResponsiveContainer height={400} className={styles.chart}>
                <BarChart 
                    data={processedData}
                    margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
                    barGap={15}
                >
                    <defs>

                        <linearGradient id='minGradient' x1='0' y1='1' x2='0' y2='0'>
                            <stop offset='0%' stopColor='#3B1D73' />
                            <stop offset='100%' stopColor='#5E22D6' />
                        </linearGradient>

                        <linearGradient id='avgGradient' x1='0' y1='1' x2='0' y2='0'>
                            <stop offset='0%' stopColor='#48238F' />
                            <stop offset='100%' stopColor='#3691E1' />
                        </linearGradient>

                        <linearGradient id='maxGradient' x1='0' y1='1' x2='0' y2='0'>
                            <stop offset='0%' stopColor='#3C77FF' />
                            <stop offset='100%' stopColor='#87B7FF' />
                        </linearGradient>

                    </defs>
                    
                    <CartesianGrid 
                        strokeDasharray='3 3' 
                        vertical={false}
                    />

                    <XAxis 
                        dataKey='company' 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize,
                            fill: '#666'
                        }}
                        height={60}
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
                        width={50}
                        domain={[0, 'dataMax']}
                        tickFormatter={(value) => {
                            return `$${value.toFixed(0)}`
                        }}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />
                    
                    <Legend 
                        verticalAlign='bottom'
                        height={36}
                        className='text-12'
                    />

                    <Bar 
                        name='Min' 
                        dataKey='min' 
                        fill='url(#minGradient)' 
                        radius={[20, 20, 0, 0]}
                        barSize={barSize}
                    >
                        <LabelList 
                            dataKey='min'
                            position='top'
                            formatter={(value: number) => {
                                return formatPrice(value)
                            }}
                            fontSize={12}
                            offset={5}
                        />
                    </Bar>
                    
                    <Bar 
                        name='Avg' 
                        dataKey='avg' 
                        fill='url(#avgGradient)'
                        radius={[20, 20, 0, 0]}
                        barSize={barSize}
                    >
                        <LabelList 
                            dataKey='avg'
                            position='top'
                            formatter={(value: number) => {
                                return formatPrice(value)
                            }}
                            fontSize={12}
                            offset={5}
                        />
                    </Bar>
                    
                    <Bar 
                        name='Max'
                        dataKey='max'
                        fill='url(#maxGradient)'
                        radius={[20, 20, 0, 0]}
                        barSize={barSize}
                    >
                        <LabelList 
                            dataKey='max'
                            position='top'
                            formatter={(value: number) => {
                                return formatPrice(value)
                            }}
                            fontSize={12}
                            offset={5}
                        />
                    </Bar>
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}