import { UUID } from 'crypto';

export class CustomerProfile {
  constructor(
    public userId: UUID,
    public shipping_address: string,
  ) {}
}
