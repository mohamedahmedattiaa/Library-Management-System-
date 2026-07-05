import type { IAuthor } from "./author.model.js";
import { AuthorModel } from "./author.model.js";
import type {
  CreateAuthorDto,
  UpdateAuthorDto,
  AuthorResponseDto,
} from "./author.dto.js";
import { HttpException } from "../../utils/http-exception.js";

export class AuthorService {
  async create(dto: CreateAuthorDto): Promise<AuthorResponseDto> {
    const exist = await AuthorModel.findOne({ name: dto.name });
    if (exist) throw HttpException.conflict("The Author is already exist");
    const user = await AuthorModel.create({ ...dto });
    return this.toResponse(user);
  }
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await AuthorModel.countDocuments();
    const authors = await AuthorModel.find().skip(skip).limit(limit);
    return {
      data: authors.map((u) => this.toResponse(u)),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }
  async findById(id: string): Promise<AuthorResponseDto> {
    const author = await AuthorModel.findById(id);
    if (!author) throw HttpException.notFound("author not found");
    return this.toResponse(author);
  }
  async update(id: string, dto: UpdateAuthorDto): Promise<AuthorResponseDto> {
    if (dto.name) {
      const taken = await AuthorModel.findOne({
        name: dto.name,
        _id: { $ne: id },
      });
      if (taken) throw HttpException.conflict("name already in use");
    }
    const author = await AuthorModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!author) throw HttpException.notFound("Author not found");
    return this.toResponse(author);
  }
  async remove(id: string): Promise<void> {
    const author = await AuthorModel.findByIdAndDelete(id);
    if (!author) throw HttpException.notFound("The author is not found");
  }

  private toResponse(author: IAuthor): AuthorResponseDto {
    return {
      id: String(author._id),
      name: author.name,
      bio: author.bio,
      nationality: author.nationality,
      birthYear: author.birthYear,
      createdAt: author.createdAt,
    };
  }
}
