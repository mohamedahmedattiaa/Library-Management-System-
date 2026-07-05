import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  isbn: string;
  description?: string;
  publishYear?: number;
  totalCopies: number;
  availableCopies: number;
  coverImage?: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    publishYear: { type: Number },
    totalCopies: { type: Number, required: true, default: 1, min: 1 },
    availableCopies: { type: Number, required: true, default: 1, min: 0 },
    coverImage: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true },
);

bookSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export const BookModel = mongoose.model<IBook>("Book", bookSchema);
