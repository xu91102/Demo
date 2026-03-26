import { AppError } from "../../shared/errors/app-error";
import { CreateUserInput, PaginatedUsers, UpdateUserInput, UserListQuery } from "./user.types";
import { UserRepository } from "./user.repository";

const isDuplicateEntryError = (error: unknown) => {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "ER_DUP_ENTRY"
  );
};

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(input: CreateUserInput) {
    try {
      const user = await this.userRepository.create(input);

      if (!user) {
        throw new AppError(500, "Failed to create user");
      }

      return user;
    } catch (error) {
      if (isDuplicateEntryError(error)) {
        throw new AppError(409, "Username or email already exists");
      }

      throw error;
    }
  }

  async listUsers(query: UserListQuery): Promise<PaginatedUsers> {
    const { items, total } = await this.userRepository.findAll(query);

    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize)
      }
    };
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  }

  async updateUser(id: number, input: UpdateUserInput) {
    await this.getUserById(id);

    try {
      const user = await this.userRepository.update(id, input);

      if (!user) {
        throw new AppError(404, "User not found");
      }

      return user;
    } catch (error) {
      if (isDuplicateEntryError(error)) {
        throw new AppError(409, "Email already exists");
      }

      throw error;
    }
  }

  async deleteUser(id: number) {
    const deleted = await this.userRepository.softDelete(id);

    if (!deleted) {
      throw new AppError(404, "User not found");
    }
  }
}

export const userService = new UserService(new UserRepository());
