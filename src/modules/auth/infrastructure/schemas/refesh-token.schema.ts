import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RefreshTokenSchema = {
  body: z.object({
    refresh_token: z.string().nonempty('El token de refresco no puede estar vacío'),
  }),
};

export class InRefreshTokenBodyDto extends createZodDto(RefreshTokenSchema.body) {}
