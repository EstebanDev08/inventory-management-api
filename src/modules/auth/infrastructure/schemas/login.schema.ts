import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const InLoginSchema = {
  body: z.object({
    email: z.string().nonempty().email('Debe ser un email válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
};

export class LoginBodyDto extends createZodDto(InLoginSchema.body) {}
