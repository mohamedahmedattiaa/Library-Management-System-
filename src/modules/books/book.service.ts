import type { IBook } from "./book.model.js";
import { BookModel } from "./book.model.js";
import { AuthorModel } from "../authors/author.model.js";
import { CategoryModel } from "../categories/category.model.js";
import type {
  CreateBookDto,
  UpdateBookDto,
  BookResponseDto,
} from "./book.dto.js";
import { HttpException } from "../../utils/http-exception.js";

export class BookService {
  async create(dto: CreateBookDto): Promise<BookResponseDto> {
    const authorExists = await AuthorModel.findById(dto.author);
    if (!authorExists) throw HttpException.notFound("Author not found");

    const categoryExists = await CategoryModel.findById(dto.category);
    if (!categoryExists) throw HttpException.notFound("Category not found");

    const book = await BookModel.create({
      ...dto,
      availableCopies: dto.totalCopies,
    });

    return this.toResponse(book);
  }
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await BookModel.countDocuments();
    const book = await BookModel.find()
      .skip(skip)
      .limit(limit)
      .populate("author", "name")
      .populate("category", "name");
    return {
      data: book.map((u) => this.toResponse(u)),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }
  async findById(id: string): Promise<BookResponseDto> {
    const book = await BookModel.findById(id)
      .populate("author", "name")
      .populate("category", "name");
    if (!book) throw HttpException.notFound("book not found");
    return this.toResponse(book);
  }
  async search(query: string): Promise<BookResponseDto[]> {
    const books = await BookModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } },
      ],
    })
      .populate("author", "name")
      .populate("category", "name");

    return books.map((b) => this.toResponse(b));
  }
  async update(id: string, dto: UpdateBookDto): Promise<BookResponseDto> {
    if (dto.isbn) {
      const taken = await BookModel.findOne({
        isbn: dto.isbn,
        _id: { $ne: id },
      });
      if (taken) throw HttpException.conflict("isbn already in use");
    }

    if (dto.author) {
      const authorExists = await AuthorModel.findById(dto.author);
      if (!authorExists) throw HttpException.notFound("Author not found");
    }

    if (dto.category) {
      const categoryExists = await CategoryModel.findById(dto.category);
      if (!categoryExists) throw HttpException.notFound("Category not found");
    }

    const book = await BookModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    })
      .populate("author", "name")
      .populate("category", "name");

    if (!book) throw HttpException.notFound("book not found");

    return this.toResponse(book);
  }
  async remove(id: string): Promise<void> {
    const book = await BookModel.findByIdAndDelete(id);
    if (!book) throw HttpException.notFound("The book is not found");
  }

  private toResponse(book: IBook): BookResponseDto {
    const author = (book.author as any).name
      ? {
          id: String((book.author as any)._id),
          name: (book.author as any).name,
        }
      : String(book.author);

    const category = (book.category as any).name
      ? {
          id: String((book.category as any)._id),
          name: (book.category as any).name,
        }
      : String(book.category);

    return {
      id: String(book._id),
      title: book.title,
      isbn: book.isbn,
      description: book.description,
      publishYear: book.publishYear,
      coverImage: book.coverImage,
      author,
      category,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };
  }
}
