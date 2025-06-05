'use client'

// libraries
import clsx from 'clsx'
import { useState, useRef } from 'react'

// SVG components
import USASVG from './SVGs/USA'
import CanadaSVG from './SVGs/Canada'
import EuropeSVG from './SVGs/Europe'

// css
import styles from './index.module.scss'

// interface
export interface MapsProps {
    location?: 'US' | 'CA' | 'EU'
    data: Array<{
        geo: string
        name: string
        values: Array<{
            query: string
            value: number
        }>
    }>
}

export default function Maps({
    location,
    data
}: MapsProps) {
    // Safety check for data
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div>No data available</div>
    }

    // Calculate value ranges and color categories
    const getValueRanges = () => {
        // Extract all values from the data
        const allValues = data
            .filter(item => item.values && item.values.length > 0)
            .map(item => item.values[0].value)
        
        if (allValues.length === 0) return null
        
        const minValue = Math.min(...allValues)
        const maxValue = Math.max(...allValues)
        
        // Calculate range per category (divide into 4 equal parts)
        const range = maxValue - minValue
        const rangePerCategory = range / 4
        
        return {
            min: minValue,
            max: maxValue,
            categories: [
                { min: 0, max: 25, color: '#ADD8F6' }, // lightblue
                { min: 26, max: 50, color: '#D8E164' }, // yellow
                { min: 51, max: 75, color: '#E18E36' }, // orange
                { min: 76, max: 100, color: '#E13639' } // red
            ]
        }
    }

    // Normalize value to 0-100 scale
    const normalizeValue = (value: number): number => {
        const ranges = getValueRanges()
        if (!ranges) return 0
        
        const { min, max } = ranges
        if (max === min) return 100 // If all values are the same, set to max
        
        return Math.round(((value - min) / (max - min)) * 100)
    }

    // Get color for a specific value
    const getColorForValue = (value: number): string => {
        const ranges = getValueRanges()
        if (!ranges) return '#E5E5E5' // default gray if no data
        
        const normalizedValue = normalizeValue(value)
        
        for (const category of ranges.categories) {
            if (normalizedValue >= category.min && normalizedValue <= category.max) {
                return category.color
            }
        }
        
        return '#E5E5E5' // default gray if value doesn't fit any category
    }

    // Get color for a region/state
    const getStateColor = (stateId: string, stateName: string): string => {
        const stateData = data.find(item => {
            // Extract state/region code from geo field based on location
            let code = ''
            switch (location) {
                case 'US':
                    code = item.geo ? item.geo.replace('US-', '') : ''
                    break
                case 'CA':
                    code = item.geo ? item.geo.replace('CA-', '') : ''
                    break
                case 'EU':
                    code = item.geo ? item.geo.replace('EU-', '') : ''
                    break
                default:
                    code = item.geo || ''
            }
            return code === stateId || item.name === stateName
        })
        
        if (stateData && stateData.values && stateData.values.length > 0) {
            return getColorForValue(stateData.values[0].value)
        }
        
        return '#E5E5E5' // default gray for regions with no data
    }

    // State for mouse position and hovered state info
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [hoveredState, setHoveredState] = useState<{ name: string, value: number } | null>(null)
    const mapRef = useRef<HTMLDivElement>(null)

    // Handle mouse move over the map
    const handleMouseMove = (e: React.MouseEvent) => {
        if (mapRef.current) {
            const rect = mapRef.current.getBoundingClientRect()
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            })
        }
    }

    // Check if a region/state has data (value > 0)
    const hasData = (stateId: string, stateName: string): boolean => {
        const stateData = data.find(item => {
            // Extract state/region code from geo field based on location
            let code = ''
            switch (location) {
                case 'US':
                    code = item.geo ? item.geo.replace('US-', '') : ''
                    break
                case 'CA':
                    code = item.geo ? item.geo.replace('CA-', '') : ''
                    break
                case 'EU':
                    code = item.geo ? item.geo.replace('EU-', '') : ''
                    break
                default:
                    code = item.geo || ''
            }
            return code === stateId || item.name === stateName
        })
        return !!(stateData && stateData.values && stateData.values.length > 0 && stateData.values[0].value > 0)
    }

    // Handle mouse enter/leave for SVG paths (regions/states)
    const handleStateMouseEnter = (e: React.MouseEvent<SVGPathElement>) => {
        const stateId = e.currentTarget.id
        const stateName = e.currentTarget.getAttribute('data-name') || stateId
        
        // Find the corresponding data for this region/state
        const stateData = data.find(item => {
            // Extract state/region code from geo field based on location
            let code = ''
            switch (location) {
                case 'US':
                    code = item.geo ? item.geo.replace('US-', '') : ''
                    break
                case 'CA':
                    code = item.geo ? item.geo.replace('CA-', '') : ''
                    break
                case 'EU':
                    code = item.geo ? item.geo.replace('EU-', '') : ''
                    break
                default:
                    code = item.geo || ''
            }
            return code === stateId || item.name === stateName
        })
        
        // Only show tooltip if the region/state has data
        if (stateData && stateData.values && stateData.values.length > 0 && stateData.values[0].value > 0) {
            setHoveredState({
                name: stateData.name,
                value: stateData.values[0].value
            })
            setIsHovering(true)
        }
    }

    const handleStateMouseLeave = () => {
        setIsHovering(false)
    }

    // Function to render the appropriate SVG based on location
    const renderMapSVG = () => {
        const svgProps = {
            getStateColor,
            hasData,
            handleStateMouseEnter,
            handleStateMouseLeave,
            styles
        }

        switch (location) {
            case 'US':
                return <USASVG {...svgProps} />
            case 'CA':
                return <CanadaSVG {...svgProps} />
            case 'EU':
                return <EuropeSVG {...svgProps} />
            default:
                return <div>Unsupported map location: {location}</div>
        }
    }

    // Get region label based on location
    const getRegionLabel = () => {
        switch (location) {
            case 'US':
                return 'State'
            case 'CA':
                return 'Province'
            case 'EU':
                return 'Country'
            default:
                return 'Region'
        }
    }

    return (
        <div className={styles.component}>
            <div 
                className={styles.map} 
                ref={mapRef}
                onMouseMove={handleMouseMove}
            >
                {isHovering && hoveredState && (
                    <div 
                        className={styles.hover}
                        style={{
                            left: `${mousePosition.x}px`,
                            top: `${mousePosition.y}px`
                        }}
                    >
                        <p className='text-16'>
                            {getRegionLabel()}: <strong>{hoveredState.name}</strong><br />
                            Value: {hoveredState.value}
                        </p>
                    </div>
                )}

                {renderMapSVG()}

            </div>

            <div className={styles.pills}>
                {data.map((item, index) => {
                    const value = item.values && item.values.length > 0 ? item.values[0].value : 0

                    return (
                        <div
                            key={index}
                            className={clsx(styles.pill, (!value || value === 0) ? styles.disabled : '')}
                            style={{
                                backgroundColor: value === 0 ? '#F3F4F6' : getStateColor(item.geo, item.name)
                            }}
                        >
                            <p
                                className='text-12 gray-800'
                                style={{
                                    color: value === 0 ? '#6B7280' : normalizeValue(value) > 50 ? 'white' : ''
                                }}
                            >
                                <strong>{item.name}:</strong> {value}
                            </p>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}