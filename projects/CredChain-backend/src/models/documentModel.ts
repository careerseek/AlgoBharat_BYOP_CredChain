// import mongoose, { Schema, Document } from 'mongoose';

// export interface IUserDocument extends Document {
//   userId: mongoose.Types.ObjectId;
//   docId: string; // Unique document ID from issuer
//   description?: string;
//   docType: string; // e.g., "PECR", "12MARKSHEET"
//   issueDate: Date;
//   issuerId: string; // e.g., "XYZUNI1234"
//   orgId: string; // Organization code (e.g., "002317")
//   orgName: string; // Human-friendly name
//   parameters?: Record<string, string>; // e.g., { "rollNumber": "123456" }
//   udf1?: string; // e.g., PAN or other custom ID
//   hash?: string;
//   ipfsUrl?: string;
//   verified: boolean;
// }

// const DocumentSchema = new Schema<IUserDocument>({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   docId: { type: String, required: true },
//   description: { type: String, required: true },
//   docType: { type: String, required: true },
//   issueDate: { type: Date, required: true },
//   issuerId: { type: String, required: true },
//   orgId: { type: String, required: true },
//   orgName: { type: String, required: true },
//   parameters: { type: Map, of: String },
//   udf1: String,
//   hash: String,
//   ipfsUrl: String,
//   verified: { type: Boolean, default: false },
// });

// // ✅ Add unique compound index to prevent duplicate documents per user
// DocumentSchema.index({ userId: 1, docId: 1 }, { unique: true });

// export const UserDocument = mongoose.model<IUserDocument>('UserDocument', DocumentSchema);





// projects/CredChain-backend/src/models/documentModel.ts
import { Schema, model, Document as MongooseDoc } from 'mongoose'

// 1. TS interface for a document
export interface IDocument extends MongooseDoc {
  userId: string
  type: 'self' | 'digilocker' | 'thirdparty'
  assetId: number                // The NFT ASA ID
  rawData?: Record<string, any>  // Whatever the original payload was
  meta: {
    rootHex: string              // Merkle root hex
    sigB64: string               // User’s signature on that root
    fields: string[]             // Which fields were hashed
    [k: string]: any             // Extra proof‐related data
  }
  createdAt: Date
  updatedAt: Date
}

// 2. Mongoose schema
const documentSchema = new Schema<IDocument>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['self', 'digilocker', 'thirdparty'],
  },
  assetId: {
    type: Number,
    required: true,
  },
  rawData: {
    type: Schema.Types.Mixed,
    required: false,
  },
  meta: {
    rootHex: { type: String, required: true },
    sigB64:  { type: String, required: true },
    fields:  { type: [String], required: true },
  },
}, {
  timestamps: true,
})

// 3. Ensure a user can’t mint the same NFT twice
documentSchema.index({ userId: 1, assetId: 1 }, { unique: true })

// 4. Export the model value under the name your routes expect
export const DocumentModel = model<IDocument>('Document', documentSchema)
