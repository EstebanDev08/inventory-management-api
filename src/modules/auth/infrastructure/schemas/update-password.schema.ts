import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdatePasswordSchema = {
  body: z.object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(128, 'New password must be less than 128 characters'),
  }),
};

export class UpdatePasswordBodyDto extends createZodDto(UpdatePasswordSchema.body) {}
