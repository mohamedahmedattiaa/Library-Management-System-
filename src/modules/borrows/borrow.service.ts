import { BorrowModel } from "./borrow.model.js";
import type { IBorrow } from "./borrow.model.js";
import { BookModel } from "../books/book.model.js";
import type { CreateBorrowDto, BorrowResponseDto } from "./borrow.dto.js";
import { HttpException } from "../../utils/http-exception.js";

export class BorrowService {
  async borrowBook(
    userId: string,
    dto: CreateBorrowDto,
  ): Promise<BorrowResponseDto> {
    const book = await BookModel.findById(dto.bookId);
    if (!book) throw HttpException.notFound("The book is not found");
    if (book.availableCopies <= 0)
      throw HttpException.conflict("No copies available");
    const alreadyBorrowed = await BorrowModel.findOne({
      user: userId,
      book: dto.bookId,
      status: "active",
    });
    if (alreadyBorrowed)
      throw HttpException.conflict("You already have this book borrowed");
    book.availableCopies -= 1;
    await book.save();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrow = await BorrowModel.create({
      user: userId,
      book: dto.bookId,
      borrowDate: new Date(),
      dueDate,
      status: "active",
    });
    const populated = await BorrowModel.findById(borrow._id)
      .populate("user", "name")
      .populate("book", "title");

    return this.toResponse(populated!);
  }

  async returnBook(
    borrowId: string,
    userId: string,
  ): Promise<BorrowResponseDto> {
    const borrow = await BorrowModel.findById(borrowId);
    if (!borrow) throw HttpException.notFound("Borrow record not found");

    if (borrow.user.toString() !== userId) {
      throw HttpException.forbidden("Not your borrow record");
    }

    if (borrow.status !== "active") {
      throw HttpException.badRequest("This book has already been returned");
    }

    borrow.returnDate = new Date();
    borrow.status = "returned";
    await borrow.save();

    const book = await BookModel.findById(borrow.book);
    if (!book) throw HttpException.notFound("Book not found");

    book.availableCopies += 1;
    await book.save();

    const populated = await BorrowModel.findById(borrow._id)
      .populate("user", "name")
      .populate("book", "title");

    return this.toResponse(populated!);
  }

  async myActiveBorrows(userId: string): Promise<BorrowResponseDto[]> {
    const borrow = await BorrowModel.find({
      user: userId,
      status: "active",
    })
      .populate("user", "name")
      .populate("book", "title");
    return borrow.map((b) => this.toResponse(b));
  }

  async myHistory(userId: string): Promise<BorrowResponseDto[]> {
    const borrow = await BorrowModel.find({ user: userId })
      .populate("user", "name")
      .populate("book", "title")
      .sort({ createdAt: -1 });
    return borrow.map((b) => this.toResponse(b));
  }

  async overdue(): Promise<BorrowResponseDto[]> {
    const borrow = await BorrowModel.find({
      status: "active",
      dueDate: { $lt: new Date() },
    })
      .populate("user", "name")
      .populate("book", "title");
    return borrow.map((b) => this.toResponse(b));
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await BorrowModel.countDocuments();
    const borrow = await BorrowModel.find()
      .skip(skip)
      .limit(limit)
      .populate("user", "name")
      .populate("book", "title");
    return {
      data: borrow.map((u) => this.toResponse(u)),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }
  private toResponse(borrow: IBorrow): BorrowResponseDto {
    const user = (borrow.user as any).name
      ? {
          id: String((borrow.user as any)._id),
          name: (borrow.user as any).name,
        }
      : String(borrow.user);

    const book = (borrow.book as any).title
      ? {
          id: String((borrow.book as any)._id),
          title: (borrow.book as any).title,
        }
      : String(borrow.book);

    return {
      id: String(borrow._id),
      user,
      book,
      borrowDate: borrow.borrowDate,
      dueDate: borrow.dueDate,
      returnDate: borrow.returnDate,
      status: borrow.status,
      createdAt: borrow.createdAt,
    };
  }
}
