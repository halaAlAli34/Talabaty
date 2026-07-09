import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPartnerProfile extends Document {
  userId: Types.ObjectId;
  storeName: string;
  description?: string;
  address: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const partnerProfileSchema = new Schema<IPartnerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    storeName: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPartnerProfile>("PartnerProfile", partnerProfileSchema);
