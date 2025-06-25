import { Body, Controller, Post } from '@nestjs/common';

import { CreateCustomerCommand } from '#src/modules/user/app/usecases/create-customer/create-customer.command';

import { HttpCreateCustomerDTO } from '../../../schemas/create-customer.schema';

import { CreateCustomerUseCase } from '#user/app/usecases/create-customer/create-customer.usecase';
import { CreateCustomerDTO } from '#user/app/usecases/create-customer/out-create-customer.dto';

@Controller('user')
export class CreateCustomerController {
  constructor(private readonly createCustomer: CreateCustomerUseCase) {}

  @Post('/customer')
  async run(@Body() createUserDto: HttpCreateCustomerDTO): Promise<CreateCustomerDTO> {
    const command = CreateCustomerCommand.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: createUserDto.password,
      shipping_address: createUserDto.shipping_address,
    });

    return this.createCustomer.run(command);
  }
}
