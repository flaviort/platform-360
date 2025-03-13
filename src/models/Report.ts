import mongoose from 'mongoose'

// Create a completely schemaless model
const ReportSchema = new mongoose.Schema({}, {
    strict: false,
    minimize: false,
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
    versionKey: false,
    transform: (doc: any, ret: any) => ret
})

// If model exists, delete it to ensure clean slate
if (mongoose.models.ReportV2) {
    delete mongoose.models.ReportV2
}

export default mongoose.model('ReportV2', ReportSchema) 