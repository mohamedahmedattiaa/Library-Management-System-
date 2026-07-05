import { UserModel } from "./user.model.js";
import type { IUser } from "./user.model.js";
import { hashPassword, comparePassword } from "../../utils/crypto.js";
import { HttpException } from "../../utils/http-exception.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserResponseDto,
} from "./user.dto.js";

export class UserService {
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await UserModel.findOne({ email: dto.email });
    if (exists) throw HttpException.conflict("The user is already exist");
    const hashed = await hashPassword(dto.password);
    const user = await UserModel.create({ ...dto, password: hashed });
    return this.toResponse(user);
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await UserModel.countDocuments();
    const users = await UserModel.find().skip(skip).limit(limit);
    return {
      data: users.map((u) => this.toResponse(u)),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await UserModel.findById(id);
    if (!user) throw HttpException.notFound("User not found");
    return this.toResponse(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    if (dto.email) {
      const taken = await UserModel.findOne({
        email: dto.email,
        _id: { $ne: id },
      });
      if (taken) throw HttpException.conflict("Email already in use");
    }
    const user = await UserModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!user) throw HttpException.notFound("User not found");
    return this.toResponse(user);
  }

  async remove(id: string): Promise<void> {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) throw HttpException.notFound("The user is not found");
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    const user = await UserModel.findById(id).select("+password");
    if (!user) throw HttpException.notFound("User not found");
    const match = await comparePassword(dto.currentPassword, user.password);
    if (!match) throw HttpException.badRequest("Current password is incorrect");
    user.password = await hashPassword(dto.newPassword);
    await user.save();
  }

  private toResponse(user: IUser): UserResponseDto {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}
