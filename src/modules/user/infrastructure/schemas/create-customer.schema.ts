import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const InCreateCustomerSchema = {
  body: z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Debe ser un email válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    shipping_address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  }),
};

export class HttpCreateCustomerDTO extends createZodDto(InCreateCustomerSchema.body) {}
