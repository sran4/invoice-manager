import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkDescription extends Document {
  userId: string;
  title: string;
  description: string;
  rate?: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkDescriptionSchema = new Schema<IWorkDescription>({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    min: 0,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
WorkDescriptionSchema.index({ userId: 1, title: 1 });

// Clear the model from cache to ensure fresh schema
if (mongoose.models.WorkDescription) {
  delete mongoose.models.WorkDescription;
}

export default mongoose.model<IWorkDescription>('WorkDescription', WorkDescriptionSchema);

