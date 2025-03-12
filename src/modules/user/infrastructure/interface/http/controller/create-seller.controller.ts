import { Body, Controller, Post } from '@nestjs/common';

import { CreateSellerCommand } from '#src/modules/user/app/usecases/create-seller/create-seller.command';
import { CreateSellerUseCase } from '#src/modules/user/app/usecases/create-seller/create-seller.usecase';
import { CreateSellerDTO } from '#src/modules/user/app/usecases/create-seller/out-create-seller.dto';

import { HttpCreateSellerDto } from '../../../schemas/create-seller.schema';

@Controller('user')
export class CreateSellerController {
  constructor(private readonly createSellerUseCase: CreateSellerUseCase) {}

  @Post('/seller')
  async run(@Body() body: HttpCreateSellerDto): Promise<CreateSellerDTO> {
    const command = CreateSellerCommand.create({
      email: body.email,
      name: body.name,
      password: body.password,
      store_name: body.store_name,
      store_description: body.store_description,
    });

    return this.createSellerUseCase.run(command);
  }
}
