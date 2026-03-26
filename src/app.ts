import cors from "cors";
import express from "express";

import { userRouter } from "./modules/users/user.route";
import { AppError } from "./shared/errors/app-error";
import { errorHandler } from "./shared/middleware/error-handler";
import { setupSwagger } from "./shared/swagger/swagger";
import { sendSuccess } from "./shared/utils/api-response";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    sendSuccess(res, "Service is healthy", {
      status: "ok",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/users", userRouter);
  setupSwagger(app);

  app.use((_req, _res, next) => {
    next(new AppError(404, "Route not found"));
  });

  app.use(errorHandler);

  return app;
};
