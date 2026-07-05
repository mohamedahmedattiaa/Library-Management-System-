import mongoose, { Schema, Document } from "mongoose";

export interface IAuthor extends Document {
  name: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

const authorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    bio: { type: String },
    nationality: { type: String },
    birthYear: { type: Number },
  },
  { timestamps: true },
);

authorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export const AuthorModel = mongoose.model<IAuthor>("Author", authorSchema);
