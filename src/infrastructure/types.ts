// Paginated Result
export interface PaginatedResult<T> {
  result: T[];
  more?: boolean;
  nextCursor?: string | null;
}
