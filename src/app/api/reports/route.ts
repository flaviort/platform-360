import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Report from '@/models/Report'

export async function GET() {
    try {
        await connectDB()
        const reports = await Report.find()
        console.log('All reports from DB:', reports)  // Log what we're fetching
        
        return NextResponse.json({
            success: true,
            data: reports
        })
    } catch (error) {
        console.error('Error fetching reports:', error)
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch reports'
            },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        await connectDB()
        const body = await request.json()
        const report = await Report.create(body)
        
        return NextResponse.json({
            success: true,
            data: report
        })
    } catch (error) {
        console.error('Error details:', error)
        return NextResponse.json({ 
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create report'
        }, { status: 500 })
    }
} 