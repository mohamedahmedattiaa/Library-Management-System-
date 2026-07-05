import type { ICategory } from "./category.model.js";
import { CategoryModel } from "./category.model.js";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from "./category.dto.js";
import { HttpException } from "../../utils/http-exception.js";

export class CategoryService {
  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const exist = await CategoryModel.findOne({ name: dto.name });
    if (exist) throw HttpException.conflict("The Category is already exist");
    const category = await CategoryModel.create({ ...dto });
    return this.toResponse(category);
  }
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await CategoryModel.countDocuments();
    const category = await CategoryModel.find().skip(skip).limit(limit);
    return {
      data: category.map((u) => this.toResponse(u)),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }
  async findById(id: string): Promise<CategoryResponseDto> {
    const category = await CategoryModel.findById(id);
    if (!category) throw HttpException.notFound("category not found");
    return this.toResponse(category);
  }
  async update(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    if (dto.name) {
      const taken = await CategoryModel.findOne({
        name: dto.name,
        _id: { $ne: id },
      });
      if (taken) throw HttpException.conflict("name already in use");
    }
    const category = await CategoryModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!category) throw HttpException.notFound("category not found");
    return this.toResponse(category);
  }
  async remove(id: string): Promise<void> {
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) throw HttpException.notFound("The category is not found");
  }

  private toResponse(category: ICategory): CategoryResponseDto {
    return {
      id: String(category._id),
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
    };
  }
}
