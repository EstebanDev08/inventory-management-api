import { UUID } from 'crypto';

import { parse, stringify, v1 as uuidV1 } from 'uuid';

export class UuidHandler {
  static newUuid(): UUID {
    return uuidV1() as UUID;
  }

  static uuidToBin(uuid: UUID): Buffer {
    return Buffer.from(parse(uuid));
  }

  static binToUuid(bin: Buffer): UUID {
    return stringify(Uint8Array.from(bin)) as UUID;
  }
}
