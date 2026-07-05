import mongoose, { Schema, Document, Types } from "mongoose";

export type BorrowStatus = "active" | "returned" | "overdue";

export interface IBorrow extends Document {
  user: Types.ObjectId;
  book: Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: BorrowStatus;
  createdAt: Date;
  updatedAt: Date;
}

const borrowschema = new Schema<IBorrow>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    borrowDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "returned", "overdue"],
      default: "active",
    },
  },
  { timestamps: true },
);

borrowschema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export const BorrowModel = mongoose.model<IBorrow>("Borrow", borrowschema);
