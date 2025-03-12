import { Body, Controller, Post } from '@nestjs/common';

import { CreateCustomerCommand } from '#src/modules/user/app/usecases/create-customer/create-customer.command';
import { CreateCustomerUseCase } from '#src/modules/user/app/usecases/create-customer/create-customer.usecase';
import { CreateCustomerDTO } from '#src/modules/user/app/usecases/create-customer/out-create-customer.dto';

import { HttpCreateCustomerDTO } from '../../../schemas/create-customer.schema';

@Controller('user')
export class CreateCustomerController {
  constructor(private readonly createCustomer: CreateCustomerUseCase) {}

  @Post('/customer')
  async run(@Body() createUserDto: HttpCreateCustomerDTO): Promise<CreateCustomerDTO> {
    const command = CreateCustomerCommand.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: createUserDto.name,
      shipping_address: createUserDto.shipping_address,
    });

    return this.createCustomer.run(command);
  }
}
