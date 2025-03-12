export abstract class ITransaction {
  abstract rollback: () => void;
}

export abstract class ITransactionService {
  abstract startTransaction<T>(clb: (tx: ITransaction) => Promise<T>): Promise<T>;
}
