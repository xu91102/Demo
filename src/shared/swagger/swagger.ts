import { Express } from "express";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "User Management Service API",
      version: "1.0.0",
      description: "A simple user management backend service for interview delivery."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],
    components: {
      schemas: {
        ApiSuccess: {
          type: "object",
          properties: {
            code: { type: "integer", example: 200 },
            message: { type: "string", example: "Request succeeded" },
            data: { type: "object" }
          }
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "alice" },
            email: { type: "string", example: "alice@example.com" },
            nickname: { type: "string", nullable: true, example: "Alice" },
            phone: { type: "string", nullable: true, example: "13800138000" },
            status: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        CreateUserInput: {
          type: "object",
          required: ["username", "email"],
          properties: {
            username: { type: "string", example: "alice" },
            email: { type: "string", example: "alice@example.com" },
            nickname: { type: "string", nullable: true, example: "Alice" },
            phone: { type: "string", nullable: true, example: "13800138000" },
            status: { type: "integer", enum: [0, 1], example: 1 }
          }
        },
        UpdateUserInput: {
          type: "object",
          properties: {
            email: { type: "string", example: "alice.updated@example.com" },
            nickname: { type: "string", nullable: true, example: "Alice Updated" },
            phone: { type: "string", nullable: true, example: "13900139000" },
            status: { type: "integer", enum: [0, 1], example: 1 }
          }
        }
      }
    }
  },
  apis: [
    path.resolve(process.cwd(), "src/modules/users/user.route.ts"),
    path.resolve(process.cwd(), "dist/modules/users/user.route.js")
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
