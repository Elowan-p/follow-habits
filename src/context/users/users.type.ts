export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDTO = Partial<CreateUserDTO>;
