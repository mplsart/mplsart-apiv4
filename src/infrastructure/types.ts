// Paginated Result
import { z } from 'zod';

export interface PaginatedResult<T> {
  result: T[];
  more?: boolean;
  nextCursor?: string | null;
}

export const BaseListParams = z.object({
  limit: z.optional(z.string().regex(/^\d+$/).transform(Number)).default('25'),
  //limit: z.number().optional().default(25),
  order: z.string().optional(),
  cursor: z.string().optional()
});
