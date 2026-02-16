export type Tracking = {
  id: string;
  habitId: string;
  date: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTrackingDTO = Omit<
  Tracking,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateTrackingDTO = Partial<CreateTrackingDTO>;
