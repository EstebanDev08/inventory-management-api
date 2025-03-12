import { UUID } from 'crypto';

export class SellerProfile {
  constructor(
    public user_id: UUID,
    public store_name: string,
    public store_description: string,
  ) {}
}
