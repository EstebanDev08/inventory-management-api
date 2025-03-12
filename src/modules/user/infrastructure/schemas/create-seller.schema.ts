import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createSellerSchema = {
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    store_name: z.string(),
    store_description: z.string(),
  }),
};

export class HttpCreateSellerDto extends createZodDto(createSellerSchema.body) {}
