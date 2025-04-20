import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  userId: mongoose.Types.ObjectId;
  docId: string; // Unique document ID from issuer
  description?: string;
  docType: string; // e.g., "PECR", "12MARKSHEET"
  issueDate: Date;
  issuerId: string; // e.g., "XYZUNI1234"
  orgId: string; // Organization code (e.g., "002317")
  orgName: string; // Human-friendly name
  parameters?: Record<string, string>; // e.g., { "rollNumber": "123456" }
  udf1?: string; // e.g., PAN or other custom ID
  hash?: string;
  ipfsUrl?: string;
  verified: boolean;
}

const DocumentSchema = new Schema<IUserDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  docId: { type: String, required: true },
  description: { type: String, required: true },
  docType: { type: String, required: true },
  issueDate: { type: Date, required: true },
  issuerId: { type: String, required: true },
  orgId: { type: String, required: true },
  orgName: { type: String, required: true },
  parameters: { type: Map, of: String },
  udf1: String,
  hash: String,
  ipfsUrl: String,
  verified: { type: Boolean, default: false },
});

// ✅ Add unique compound index to prevent duplicate documents per user
DocumentSchema.index({ userId: 1, docId: 1 }, { unique: true });

export const UserDocument = mongoose.model<IUserDocument>('UserDocument', DocumentSchema);