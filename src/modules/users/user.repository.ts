import { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../../shared/db/pool";
import { CreateUserInput, UpdateUserInput, User, UserListQuery } from "./user.types";

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  nickname: string | null;
  phone: string | null;
  status: number;
  created_at: Date | string;
  updated_at: Date | string;
}

const formatDate = (value: Date | string) => new Date(value).toISOString();

const mapUserRow = (row: UserRow): User => ({
  id: row.id,
  username: row.username,
  email: row.email,
  nickname: row.nickname,
  phone: row.phone,
  status: row.status,
  createdAt: formatDate(row.created_at),
  updatedAt: formatDate(row.updated_at)
});

export class UserRepository {
  async create(input: CreateUserInput) {
    const [result] = await pool.execute<ResultSetHeader>(
      `
        INSERT INTO users (username, email, nickname, phone, status)
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        input.username,
        input.email,
        input.nickname ?? null,
        input.phone ?? null,
        input.status ?? 1
      ]
    );

    return this.findById(result.insertId);
  }

  async findById(id: number) {
    const [rows] = await pool.execute<UserRow[]>(
      `
        SELECT id, username, email, nickname, phone, status, created_at, updated_at
        FROM users
        WHERE id = ? AND deleted_at IS NULL
        LIMIT 1
      `,
      [id]
    );

    return rows[0] ? mapUserRow(rows[0]) : null;
  }

  async findAll(query: UserListQuery) {
    const filters = ["deleted_at IS NULL"];
    const values: Array<number | string> = [];

    if (query.keyword) {
      const likeKeyword = `%${query.keyword}%`;
      filters.push("(username LIKE ? OR email LIKE ? OR nickname LIKE ?)");
      values.push(likeKeyword, likeKeyword, likeKeyword);
    }

    const whereClause = filters.join(" AND ");
    const offset = (query.page - 1) * query.pageSize;

    const [countRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM users WHERE ${whereClause}`,
      values
    );

    const [rows] = await pool.execute<UserRow[]>(
      `
        SELECT id, username, email, nickname, phone, status, created_at, updated_at
        FROM users
        WHERE ${whereClause}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `,
      [...values, query.pageSize, offset]
    );

    return {
      items: rows.map(mapUserRow),
      total: Number(countRows[0].total)
    };
  }

  async update(id: number, input: UpdateUserInput) {
    const fields: string[] = [];
    const values: Array<number | string | null> = [];

    if (input.email !== undefined) {
      fields.push("email = ?");
      values.push(input.email);
    }

    if (input.nickname !== undefined) {
      fields.push("nickname = ?");
      values.push(input.nickname);
    }

    if (input.phone !== undefined) {
      fields.push("phone = ?");
      values.push(input.phone);
    }

    if (input.status !== undefined) {
      fields.push("status = ?");
      values.push(input.status);
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    await pool.execute<ResultSetHeader>(
      `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = ? AND deleted_at IS NULL
      `,
      values
    );

    return this.findById(id);
  }

  async softDelete(id: number) {
    const [result] = await pool.execute<ResultSetHeader>(
      `
        UPDATE users
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL
      `,
      [id]
    );

    return result.affectedRows > 0;
  }
}
