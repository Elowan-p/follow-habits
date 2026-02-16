export type Habit = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateHabitDTO = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateHabitDTO = Partial<CreateHabitDTO>;
