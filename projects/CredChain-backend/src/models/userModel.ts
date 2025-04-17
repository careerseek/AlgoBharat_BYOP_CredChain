import mongoose, { Schema, Document } from 'mongoose'

/**
 * Interface for the User document
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  // walletAddress?: string
  digilockerLinked: boolean 
  digilockerLinkedAt?: Date | null;
  createdAt?: Date
  // updatedAt?: Date
}

/**
 * User schema definition
 */
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // walletAddress: {
    //   type: String,
    //   default: null,
    // },
    digilockerLinked: {
      type: Boolean,
      default: false,
    },
    digilockerLinkedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'users',
  }
)

export const User = mongoose.model<IUser>('User', UserSchema)