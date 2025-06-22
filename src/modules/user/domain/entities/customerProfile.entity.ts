import { UUID } from 'crypto';

export class CustomerProfile {
  constructor(
    public user_id: UUID,
    public shipping_address: string,
  ) {}
}
