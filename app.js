import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import apiError from "./utils/apiErrors.js";
import { globalErrorHandler } from "./globalErrorHandler.js";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(apiError(`Cannot find ${req.originalUrl} !`, 404));
});

app.use(globalErrorHandler);

export default app;
