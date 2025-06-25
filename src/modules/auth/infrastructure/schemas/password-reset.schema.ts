import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const InPasswordReset = {
  body: z.object({
    token: z.string().nonempty().jwt({ message: 'Debe ser un token válido' }),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
};

export class InPasswordResetBodyDto extends createZodDto(InPasswordReset.body) {}
