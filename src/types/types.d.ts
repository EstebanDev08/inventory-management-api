type UpdateEntity<T, K extends keyof T, ExcludeFields extends keyof T = never> = Partial<
  Omit<T, 'id' | 'created_by' | 'updated_by' | ExcludeFields>
> &
  Required<Pick<T, K | 'updated_by'>> & { [P in K]: NonNullable<T[P]> };

type DateFilter = {
  entre?: {
    final?: Date;
    inicial?: Date;
  };
  unica?: Date;
};
