import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import Report from '@/models/Report'
import { Document } from 'mongoose'

interface ReportDocument extends Document {
    _id: string
    projectName: string
    reportName: string
    category: string
    project: string
    goal: string
    createdAt: Date
    reportType: string
    [key: string]: any  // For other dynamic fields
}

export async function GET() {
    try {
        
        // Get all reports from ReportV2 collection
        await connectDB()
        const reports = await Report.find() as ReportDocument[]
        
        // Group reports by project name
        const projects = reports.reduce((acc: any[], report) => {
            const projectName = report.projectName
            
            // Find if project already exists in accumulator
            const existingProject = acc.find(p => p.name === projectName)
            
            if (existingProject) {
                // Add report to existing project
                existingProject.reports.push({
                    id: report._id,
                    name: report.reportName,
                    category: report.category,
                    goal: report.goal,
                    createdAt: report.createdAt,
                    reportType: report.reportType
                })
            } else {
                // Create new project with this report
                acc.push({
                    id: report._id,
                    name: projectName,
                    reports: [{
                        id: report._id,
                        name: report.reportName,
                        category: report.category,
                        goal: report.goal,
                        createdAt: report.createdAt,
                        reportType: report.reportType
                    }]
                })
            }
            
            return acc
        }, [])

        return NextResponse.json({
            success: true,
            data: projects
        })
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch projects'
            },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        await connectDB()
        const body = await request.json()
        
        const project = await Project.create({
            ...body,
            updatedAt: new Date()
        })
        
        return NextResponse.json({
            success: true,
            data: project
        })
    } catch (error) {
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to create project'
            },
            { status: 500 }
        )
    }
} 