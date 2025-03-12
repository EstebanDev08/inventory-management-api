import { UUID } from 'crypto';

export class SellerProfile {
  constructor(
    public userId: UUID,
    public storeName: string,
    public storeDescription: string,
  ) {}
}
