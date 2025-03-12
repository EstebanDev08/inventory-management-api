import { UUID } from 'crypto';

export class AdminProfile {
  constructor(
    public userId: UUID,
    public permissions: string[],
  ) {}
}
