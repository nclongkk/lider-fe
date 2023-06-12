export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role?: string;
  status?: string;
  lastActive?: Date;
  signupTracking?: Record<string, any>;
}