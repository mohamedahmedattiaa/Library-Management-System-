import { UserModel } from "../users/user.model.js";
import type { IUser } from "../users/user.model.js";
import { hashPassword, comparePassword } from "../../utils/crypto.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { HttpException } from "../../utils/http-exception.js";
import type { LoginDto, RegisterDto, AuthResponseDto } from "./auth.dto.js";

export class AuthService {
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const exists = await UserModel.findOne({ email: dto.email });
    if (exists) throw HttpException.conflict("The user is already exist");
    const hashed = await hashPassword(dto.password);
    const user = await UserModel.create({ ...dto, password: hashed });
    const tokens = this.generateTokens(String(user._id), user.email, user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return this.toAuthResponse(user, tokens);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await UserModel.findOne({ email: dto.email }).select(
      "+password +refreshToken",
    );
    if (!user) throw HttpException.unauthorized("the account is not found");
    const match = await comparePassword(dto.password, user.password);
    if (!match) throw HttpException.unauthorized("the account is not found");
    const tokens = this.generateTokens(String(user._id), user.email, user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return this.toAuthResponse(user, tokens);
  }

  async logout(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async refreshTokens(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const verify = verifyRefreshToken(token);
    const user = await UserModel.findById(verify.userId).select(
      "+refreshToken",
    );
    if (!user || user.refreshToken !== token)
      throw HttpException.unauthorized();
    const tokens = this.generateTokens(String(user._id), user.email, user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return tokens;
  }
  private generateTokens(userId: string, email: string, role: string) {
    const accessToken = signAccessToken({ userId, email, role });
    const refreshToken = signRefreshToken({ userId, email, role });
    return { accessToken, refreshToken };
  }
  private toAuthResponse(
    user: IUser,
    tokens: { accessToken: string; refreshToken: string },
  ): AuthResponseDto {
    return {
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
