export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'agent' | 'manager' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'manager' | 'admin';
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'agent' | 'manager' | 'admin';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}
