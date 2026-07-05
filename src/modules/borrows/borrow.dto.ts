export interface CreateBorrowDto {
  bookId: string;
}

export interface BorrowResponseDto {
  id: string;
  user: string | { id: string; name: string };
  book: string | { id: string; title: string };
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: string;
  createdAt: Date;
}
