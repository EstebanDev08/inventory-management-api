import { UUID } from 'crypto';

import { customType } from 'drizzle-orm/mysql-core';

export const customDrizzleUuid = customType<{ data: UUID; driverData: string }>({
  dataType() {
    return `varchar(36)`;
  },
});
