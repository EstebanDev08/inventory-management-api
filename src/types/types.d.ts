type UpdateEntity<T, K extends keyof T = never, ExcludeFields extends keyof T = never> = Partial<
  Omit<T, 'id' | 'created_by' | ExcludeFields>
> &
  Required<Pick<T, K>> & { [P in K]: NonNullable<T[P]> };

type DateFilter = {
  entre?: {
    final?: Date;
    inicial?: Date;
  };
  unica?: Date;
};
