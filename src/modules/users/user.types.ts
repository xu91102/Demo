export interface User {
  id: number;
  username: string;
  email: string;
  nickname: string | null;
  phone: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  username: string;
  email: string;
  nickname?: string | null;
  phone?: string | null;
  status?: number;
}

export interface UpdateUserInput {
  email?: string;
  nickname?: string | null;
  phone?: string | null;
  status?: number;
}

export interface UserListQuery {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface PaginatedUsers {
  items: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
