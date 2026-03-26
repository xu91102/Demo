import { z } from "zod";

export const userIdParamsSchema = z.object({
  id: z.coerce.number().int().positive()
});

const nullableTextField = z.string().trim().max(50).nullable().optional();

export const createUserSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().trim().email().max(100),
  nickname: nullableTextField,
  phone: z.string().trim().max(20).nullable().optional(),
  status: z.coerce.number().int().min(0).max(1).optional()
});

export const updateUserSchema = z
  .object({
    email: z.string().trim().email().max(100).optional(),
    nickname: nullableTextField,
    phone: z.string().trim().max(20).nullable().optional(),
    status: z.coerce.number().int().min(0).max(1).optional()
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field must be provided for update"
  });

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  keyword: z.string().trim().max(100).optional()
});
