import { Request, Response } from "express";

import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
  userIdParamsSchema
} from "./user.validation";
import { userService } from "./user.service";

class UserController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const payload = createUserSchema.parse(req.body);
    const user = await userService.createUser(payload);

    return sendSuccess(res, "User created successfully", user, 201);
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const query = listUsersQuerySchema.parse(req.query);
    const result = await userService.listUsers(query);

    return sendSuccess(res, "Users fetched successfully", result);
  });

  detail = asyncHandler(async (req: Request, res: Response) => {
    const { id } = userIdParamsSchema.parse(req.params);
    const user = await userService.getUserById(id);

    return sendSuccess(res, "User fetched successfully", user);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = userIdParamsSchema.parse(req.params);
    const payload = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(id, payload);

    return sendSuccess(res, "User updated successfully", user);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = userIdParamsSchema.parse(req.params);
    await userService.deleteUser(id);

    return sendSuccess(res, "User deleted successfully", null);
  });
}

export const userController = new UserController();
