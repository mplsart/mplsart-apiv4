import { z } from 'zod';
import * as ex from '../../infrastructure/exceptions';

export default function validateData<T>(schema: z.ZodType<T>, data: unknown) {
  const parseResult = schema.safeParse(data); // as unknown as typeof PostParams;
  if (parseResult.success) return parseResult.data;

  throw new ex.DataValidationError(
    'Input Error',
    parseResult.error.errors.map((e) => {
      return new ex.FieldError(e.path.join(' '), e.message);
    })
  );
}
