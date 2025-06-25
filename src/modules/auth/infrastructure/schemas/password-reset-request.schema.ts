import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const InPasswordReset = {
  body: z.object({
    email: z.string().email('Debe ser un correo electrónico válido'),
  }),
};

export class InPasswordResetRequestBodyDto extends createZodDto(InPasswordReset.body) {}
