export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: "member" | "admin";
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
