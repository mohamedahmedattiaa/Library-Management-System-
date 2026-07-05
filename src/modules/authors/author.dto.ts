export interface CreateAuthorDto {
  name: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
}

export interface UpdateAuthorDto {
  name?: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
}

export interface AuthorResponseDto {
  id: string;
  name: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
  createdAt: Date;
}
