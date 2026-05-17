import mongoose, { Schema, Document } from 'mongoose';
import { ILead } from '../types';

export interface ILeadDocument extends Omit<ILead, '_id'>, Document {}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: [true, 'Source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster filtering and search
LeadSchema.index({ status: 1, source: 1 });
LeadSchema.index({ name: 'text', email: 'text' });

export default mongoose.model<ILeadDocument>('Lead', LeadSchema);