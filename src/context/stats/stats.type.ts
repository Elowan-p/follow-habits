export type Stat = {
  id: string;
  userId: string;

  createdAt: Date;
  updatedAt: Date;
};

export type CreateStatDTO = Omit<Stat, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStatDTO = Partial<CreateStatDTO>;
