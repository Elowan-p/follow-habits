export type Stat = {
  id: string;
  userId: string;
  // Add other fields from StatEntity if known, or generic key-value for now
  createdAt: Date;
  updatedAt: Date;
};

export type CreateStatDTO = Omit<Stat, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStatDTO = Partial<CreateStatDTO>;
