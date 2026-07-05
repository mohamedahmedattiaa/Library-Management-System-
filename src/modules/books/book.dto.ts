export interface PopulatedRef {
  id: string;
  name: string;
}

export interface CreateBookDto {
  title: string;
  isbn: string;
  description?: string;
  publishYear?: number;
  totalCopies: number;
  coverImage?: string;
  author: string;
  category: string;
}

export interface UpdateBookDto {
  title?: string;
  isbn?: string;
  description?: string;
  publishYear?: number;
  coverImage?: string;
  author?: string;
  category?: string;
}

export interface BookResponseDto {
  id: string;
  title: string;
  isbn: string;
  description?: string;
  publishYear?: number;
  coverImage?: string;
  author: string | PopulatedRef;
  category: string | PopulatedRef;
  totalCopies: number;
  availableCopies: number;
  createdAt: Date;
  updatedAt: Date;
}
