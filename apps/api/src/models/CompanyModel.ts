import mongoose, { Document, Schema } from "mongoose";

// ✅ Define TypeScript interface for Company
export interface ICompany extends Document {
  name: string;
  industry: string;
  location: string;
  size?: number;
  foundedYear?: number;
  isHiring: boolean;
  domain?: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Define schema with types
const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    size: { type: Number },
    foundedYear: { type: Number },
    isHiring: { type: Boolean, default: false },
    domain: { type: String },
    rating: { type: Number, min: 0, max: 5 },
  },
  { timestamps: true }
);

// ✅ Create model
const Company = mongoose.model<ICompany>("Company", companySchema);

export default Company;
