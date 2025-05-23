'use client'

// libraries
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// components
import Warning from '@/components/Reports/components/Warning'

// css
import styles from './index.module.scss'

// interface
export interface SkuAnalysisProps {
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
            {value !== null && value !== undefined ? value.toLocaleString('en-US') : ''}
        </text>
    )
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.tooltip}>

                <p className='text-14 medium gray-600 capitalize'>
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

export default function SkuAnalysis({
    data,
    reportSummary,
    height,
    showAllNumbers
}: SkuAnalysisProps) {
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
    
    // Calculate a better domain max based on actual data
    const calculateYAxisMax = () => {
        // Find the actual max value in the data
        const maxCount = Math.max(...processedData
            .filter(item => item.count !== null)
            .map(item => item.count as number))
        
        // Round up to an appropriate value
        if (maxCount <= 10) return 10
        if (maxCount <= 20) return 20
        if (maxCount <= 50) return 50
        if (maxCount <= 100) return 100
        
        // Round to nearest 50 for values below 1000
        if (maxCount < 1000) {
            return Math.ceil(maxCount / 50) * 50
        }
        
        // Round to nearest 100 for values 500+
        return Math.ceil(maxCount / 100) * 100
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

            {hasMissingData && (
                <Warning text="Some retailers you've selected do not have enough data to completely generate this chart. For a more accurate chart, please change the queries when creating the report." />
            )}

            <div className={styles.header} data-chart-header-inner>
                
                <h4 className='text-14 gray-600'>
                    List of Retailers
                </h4>

                <span className='text-14 gray-600'>
                    {processedData.length} retailers
                </span>

            </div>

            <ResponsiveContainer height={height || 400} className={styles.chart} data-chart-main-inner>
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

                    <CartesianGrid strokeDasharray='3 3' vertical={false} />

                    <XAxis 
                        dataKey='company' 
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: '#666',
                            fontSize: 12
                        }}
                        className='text-12 capitalize'
                        textAnchor='middle'
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        type='number'
                        dataKey='count'
                        tickFormatter={(value) => value.toLocaleString('en-US')}
                        tick={{
                            fill: '#666',
                            fontSize: 10
                        }}
                        domain={[0, yAxisMax]}
                        ticks={yAxisTicks}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />

                    <Bar
                        dataKey='count'
                        radius={[20, 20, 0, 0]}
                        barSize={20}
                        spacing={20}
                        fill='url(#verticalBarsGradient)'
                    >
                        {showAllNumbers && (
                            <LabelList
                                dataKey='count'
                                content={CustomValueLabel}
                            />
                        )}
                    </Bar>

                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}